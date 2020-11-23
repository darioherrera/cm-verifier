const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const _ = require("lodash");
const Typesense = require("typesense");
let typsenseServer = {
    'nodes': [{
        'host': 'typesense.wabisabi.red',
        'port': '80',
        'protocol': 'http'
    }],
    'apiKey': 'cUUacDg1Jpnfwzg9jSxQHwNtldwW4BCPG53bMoU8cC1RfPBw',
    'connectionTimeoutSeconds': 2
}

const typeSenseClient = new Typesense.Client(typsenseServer);
const start = () => {
  
    fs.createReadStream(path.resolve(__dirname, 'input', 'metadata.csv'))
        .pipe(csv.parse({ headers: true }))
        // pipe the parsed input into a csv formatter
        .pipe(csv.format({ headers: true }))
        // Using the transform function from the formatting stream
        .transform(async(row, next) => {
            console.log(row.url)
            let code = parseInt(row.code);
            row.code = code;
            await typeSenseClient.collections('repository').documents().create(row)
            _.delay(next, 500);
        })
        .on('end', () => {
            csvStream.end();
            console.log('Process finished');
            process.exit(0);
        }).on('error', (error)=>{
            console.log("Error in typsense pipeline: ", error);
        })
}

const showCurrentTypsense = () => {
    return typsenseServer;
}

module.exports = {
    start,
    showCurrentTypsense
}