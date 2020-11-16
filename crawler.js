const CsvReader = require('promised-csv');
const reader = new CsvReader();
var Crawler = require("crawler");


const extract = (error, res, done) => {
    if (error) {
        console.log(error);
    }
    else {
        var $ = res.$;
        console.log($("title").text());
    }
    done();
}

/*  
Crawler configuration
*/
const c = new Crawler({
    maxConnections: 10,
    rateLimit: 2000,
    // This will be called for each crawled page
    callback: extract
});


const crawlUrl = (item) => {
    c.queue(item[1]);
}




(async function() {
    reader.on("row", crawlUrl);
    reader.read("./input/test.csv");
})();
