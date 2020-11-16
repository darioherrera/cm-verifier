const CsvReader = require('promised-csv');
const reader = new CsvReader();
var Crawler = require("crawler");
const repositoryModel = require("./items/repository");
const fsp = require("fs/promises");


const extract = async (error, res, done) => {
    if (error) {
        console.log(error);
    }
    else {
        let $ = res.$;
        let repo = await repositoryModel.parse($, res.options.url);
        if (repo.valid) {
            await fsp.appendFile('output.json', JSON.stringify(repo));
        } else {
            await fsp.appendFile('error.json', JSON.stringify(repo));
        }
    }
    done();
}

/*  
Crawler configuration
*/
const c = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    // This will be called for each crawled page
    callback: extract
});

const crawlUrl = (item) => {
    c.queue({ uri: item[0], url: item[0] });
}

(async function () {
    reader.on("row", crawlUrl);
    reader.read("./input/pagina1.csv");
})();
