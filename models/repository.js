const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');


const RepositorySchema = new Schema({
  name: String,
  description: String,
  url: String,
  home: String,
  timezone_string: String,
  status: { type: String, default: "Unchecked" }
});

 RepositorySchema.plugin(mongoosePaginate);

module.exports = model("repositories", RepositorySchema);
