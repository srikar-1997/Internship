const bookshelf = require("../config/knex").bookshelf;
require("./students");

const address = bookshelf.Model.extend({
  tableName: "area",
  student: function () {
    return this.belongsTo("student");
  },
});

module.exports = address;
