const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { format } = require('@fast-csv/format');
const _ = require("lodash");
const got = require("got");
const cheerio = require("cheerio");
const writeStream = fs.createWriteStream("output/metadata.csv")
const headers = ["_id", "name", "description", "url", "home", "gmt_offset", "timezone_string", "metatitle", "metadesc", "lang", "metakeywords", "favicon", "og_title", "og_description", "og_image", "og_locale", "og_twitter", "code"];
csvStream = format({ headers, quoteColumns: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false] });
csvStream.pipe(writeStream);

var handleRequest = async(row, id) => {

    try {
        console.log(row.url)
        let { body } = await got(row.url);
        const $ = await cheerio.load(body);
        const element = {};
        element.metatitle = $("title").text() || '';
        element.metadesc = $("meta[name='description']").attr('content') || '';
        element.lang = $("html").attr("lang") || '';
        // element.metatitle = $("meta[name='description']").attr('content');
        element.metakeywords = $("meta[name='keywords']").attr('content') || '';
        element.favicon = $("link[rel='icon']").attr('href') || '';
        element.og_title = $("meta[name='og:title']").attr('content') || '';
        element.og_description = $("meta[name='og:description']").attr('content') || '';
        element.og_image = $("meta[name='og:description']").attr('content') || '';
        element.og_locale = $("meta[name='og:image']").attr('content') || '';
        element.og_image = $("meta[name='og:image']").attr('content') || '';
        element.og_twitter = $("meta[name='twitter:site']").attr('content') || '';
        let fullElement = { code: id, ...row, ...element };
        if (!_.isEmpty(fullElement)) {
            csvStream.write(fullElement);
        }
    }
    catch (error) {
        let fullElement = { code: id, ...row };
        csvStream.write(fullElement);
        if (error instanceof got.HTTPError) {
            console.log(`Error ${error.statusCodes} on: ${row.url} `);
        }
        else {
            console.log(error);
        }
    }
};
(async() => {
    var i = 1;
    fs.createReadStream(path.resolve(__dirname, 'input', 'apienabled.csv'))
        .pipe(csv.parse({ headers: true }))
        // pipe the parsed input into a csv formatter
        .pipe(csv.format({ headers: true }))
        // Using the transform function from the formatting stream
        .transform((row, next) => {
            handleRequest(row, i++);
            _.delay(next, 500);
        })
        .on('end', () => {
            csvStream.end();
            process.exit();
        });

})()
