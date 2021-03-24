const bookshelf = require("../config/knex").bookshelf;
require("./address");

const newstudent = bookshelf.Model.extend({
  tableName: "newstudents",
  area: function () {
    return this.belongsTo("area", "id", "pincode");
  },
});

module.exports = newstudent;
