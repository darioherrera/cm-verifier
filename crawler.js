const CsvReader = require('promised-csv');
const reader = new CsvReader();
var Crawler = require("crawler");
const repositoryModel = require("./items/repository");

const Typesense = require("typesense");
const typeSenseClient = new Typesense.Client({
    'nodes': [{
        'host': 'localhost',
        'port': '8108',
        'protocol': 'http'
    }],
    'apiKey': 'cUUacDg1Jpnfwzg9jSxQHwNtldwW4BCPG53bMoU8cC1RfPBw',
    'connectionTimeoutSeconds': 2
})

const extract = async(error, res, done) => {
    if (error) {
        console.log(error);
        return null;
    }
    try {
        let $ = res.$;
        let repo = await repositoryModel.parse($, res.options.url, res.options.code);
        if (repo.valid) {
            console.log(res.options.url);
            await typeSenseClient.collections('repository').documents().create(repo)
        }
        done();
    }
    catch (error) {
        console.log(error);
    }

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
    c.queue({ uri: item[0], url: item[0], code: item[1] });
}

(async function() {
    reader.on("row", crawlUrl);
    reader.read("./input/pagina1.csv");
})();
