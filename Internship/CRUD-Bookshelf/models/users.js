const bookshelf = require("../config/knex").bookshelf;

const User = bookshelf.Model.extend({
  tableName: "users",
});

module.exports.User = User;
