const bookshelf = require("../config/knex").bookshelf;

const NewStudent = require("./newstudents");

const address = bookshelf.Model.extend({
  tableName: "area",

  newstudent: function () {
    return this.hasMany(NewStudent, "pincode", "pincode");
  },
});

module.exports = bookshelf.model("area", address);
