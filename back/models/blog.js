// models/blog.js
const knexConfig = require('../db/knexfile'); // Adjust the path accordingly
const knex = require('knex')(knexConfig)
const createBlog = async (blogData) => {
  return knex('blogs').insert(blogData).returning('*');
};

module.exports = {
  createBlog,
};
