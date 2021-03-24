const bookshelf = require("../config/knex").bookshelf;
const Address = require("./address");

const student = bookshelf.Model.extend({
  tableName: "student",
  area: function () {
    return this.hasOne(Address);
  },
});

module.exports = bookshelf.model("student", student);
