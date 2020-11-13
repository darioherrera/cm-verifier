const cron = require('node-cron');
const mongoose = require('mongoose');
const Repository = require("./models/repository");
const DB_URL = 'mongodb+srv://yebz:y1ENTzl2xzZwenff@wapo-57lcy.mongodb.net/posts?retryWrites=true&w=majority';
const axios = require("axios");
const { isEmpty } = require("lodash");
const urlParser = require("url");
const PromiseBird = require("bluebird");
const { pick, chain, get } = require("lodash");
mongoose.promise = require("bluebird");

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const connectDB = async () => {
    const conn = await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

let getPaginatedList = async (page = 1) => {
    let list = await Repository.paginate({ status: { $exists: false }, name: { $exists: false } }, {
        page,
        limit: 15
    });
    return list;
}


const updateField = async (site) => {
    const uri = urlParser.parse(site.url);
    let updateQuery = (site.status == 'rejected') ? { status: 'rejected' } : { ...site, valid: "checked" };
    if (uri) {
        const regExp = `/.*${uri.hostname}/`;
        console.log(uri.hostname);
        return Repository.replaceOne({ url: { $regex: regExp } }, updateQuery, { upsert: false, new: false })
    }
    else {
        return Promise.reject(site);
    }
}

const updateMany = async (list) => {
    console.log(`Updating sites: `, list.length);
    let updateRequests = list.filter(site => !isEmpty(site))
        .filter(site => !isEmpty(site.url));
    let result = await PromiseBird.mapSeries(updateRequests, site => updateField(site));
    return result;
}

const checkURL = url => {
    return axios.get(`${url}wp-json`);
}


const validateURL = async list => {
    let resulting = await Promise.allSettled(list.map(site => checkURL(site.url)));
    let results = resulting.map(result => {
        if (result.status === 'fulfilled') {
            let { value } = result;
            return pick(value.data, ['name', "description", "url", "home", "timezone_string"]);
        }
        else {
            let finalURL = result.reason.config.url;
            return {
                url: finalURL.replace("wp-json", ""),
                status: result.status
            }
        }
    })
    return results;
}

const updateSites = async (page) => {
    try {
        console.log("------ Fetching sites----------")
        let list = await getPaginatedList(page);
        console.log("------ Updating site data ----------")
        let results = await validateURL(list.docs);
        console.log("------ end of site data ----------")
        let updatePromises = await updateMany(results);

    }
    catch (err) {
        console.log(err);
    }
}

(async function () {
    connectDB();
    let { totalPages, page, nextPage } = await getPaginatedList(1);
    let i = 1;
    var task = cron.schedule('*/15 * * * * *', async () => {
        console.log(`Actualizando página ${i} de ${totalPages} `);
        await updateSites(i++);
    });
})();
