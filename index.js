const cron = require('node-cron');
const mongoose = require('mongoose');
const Repository = require("./models/repository");
const DB_URL = 'mongodb+srv://yebz:y1ENTzl2xzZwenff@wapo-57lcy.mongodb.net/posts?retryWrites=true&w=majority';
const axios = require("axios");


const { pick, chain, get } = require("lodash");
mongoose.promise = require("bluebird");

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const connectDB = async() => {
    const conn = await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

let getListSites = async() => {
    let page = getRandomArbitrary(1, 6666);
    console.log("COUNTER: ", page);
    let list = await Repository.find({ status: { $exists: false }, name: { $exists: false } }, {}, { skip: page, limit: 15 });
    return list;
}

let getPaginatedList = async(page = 1) => {
    let list = await Repository.paginate({ status: { $exists: false }, name: { $exists: false } }, {
        page,
        limit: 15
    });
    return list;
}


const updateMany = (list) => {
    console.log(`Updating sites: `, list.length);
    // console.log(list)
    list.map(async site => {
        if (site && site.status === 'rejected') {
            return await Repository.findOneAndUpdate({ url: site.url }, { status: 'rejected' });
        }
        else {
            return await Repository.findOneAndUpdate({ url: `${site.url}/` }, { ...site, valid: "checked" });
        }
    });


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

    results.map(x => console.log(x));
    return results;
}

const updateSites = async(page) => {

    try {
        console.log("------ Fetching sites----------")
        let list = await getPaginatedList(page);
        console.log("------ Updating site data ----------")
        let results = await validateURL(list.docs);
        console.log("------ end of site data ----------")
        //  await updateMany(results);
    }
    catch (err) {
        console.log(err);
    }

}

(async function() {
    connectDB();
    let { totalPages, page, nextPage } = await getPaginatedList(1);
    let i = 1;
    var task = cron.schedule('*/30 * * * * *', async() => {
        console.log(`Actualizando página ${i} de ${totalPages} `);
        await updateSites(i++);
    });

})();
