const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const _ = require("lodash");

const Typesense = require("typesense");
const typeSenseClient = new Typesense.Client({
    'nodes': [{
        'host': 'typesense.wabisabi.red',
        'port': '80',
        'protocol': 'http'
    }],
    'apiKey': 'cUUacDg1Jpnfwzg9jSxQHwNtldwW4BCPG53bMoU8cC1RfPBw',
    'connectionTimeoutSeconds': 2
});


(async () => {
    fs.createReadStream(path.resolve(__dirname, 'input', 'metadata.csv'))
        .pipe(csv.parse({ headers: true }))
        // pipe the parsed input into a csv formatter
        .pipe(csv.format({ headers: true }))
        // Using the transform function from the formatting stream
        .transform(async (row, next) => {
            console.log(row)
            let code = parseInt(row.code);
            row.code = code;
            await typeSenseClient.collections('repository').documents().create(row)
            //  handleRequest(row, i++);
            _.delay(next, 500);
        })
        .on('end', () => {
            csvStream.end();
            process.exit();
        });
})();
