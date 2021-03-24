require("dotenv").config();

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: process.env.USER,
    password: process.env.USER_PASSWORD,
    database: process.env.DATABASE,
    charset: "utf8",
  },
});

const bookshelf = require("bookshelf")(knex);

module.exports.bookshelf = bookshelf;
