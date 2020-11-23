 const fs = require('fs');
 const path = require('path');
 const csv = require('fast-csv');
 const { format } = require('@fast-csv/format');
 const _ = require("lodash");
 const got = require("got");
 const writeStream = fs.createWriteStream("output/outputfile.csv")
 const headers = ['name', 'description', 'url', 'home', 'gmt_offset', 'timezone_string'];
 csvStream = format({ headers, quoteColumns: [true, true, true, true, true, true] });
 csvStream.pipe(writeStream);

 const handleRequest = async(url) => {
  try {
   let body = await got(url).json();
   let data = _.pick(body, headers)
   if (!_.isEmpty(data)) {
    csvStream.write(data);
   }
  }
  catch (err) {
   if (err) {
    console.log("Not working: " + url)
   }
  }
 };

 const start = () => {
  fs.createReadStream(path.resolve(__dirname, 'input', 'pagina1.csv'))
   .pipe(csv.parse({ headers: true }))
   // pipe the parsed input into a csv formatter
   .pipe(csv.format({ headers: true }))
   // Using the transform function from the formatting stream
   .transform((row, next) => {
    handleRequest(`${row.url}wp-json`);
    _.delay(next, 500);
   })
   .on('end', () => {
    csvStream.end();
    process.exit();
   });
 }
 
 module.exports = {
  start
 }