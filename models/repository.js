const { Schema, model } = require("mongoose");
 

const RepositorySchema = new Schema({
  name: String,
  description: String,
  url: String,
  home: String,
  timezone_string: String,
  status: { type: String, default: "Unchecked" }
});

 

module.exports = model("repositories", RepositorySchema);
