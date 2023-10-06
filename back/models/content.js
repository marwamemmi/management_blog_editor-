// models/content.js
const knexConfig = require('../db/knexfile'); // Adjust the path accordingly
const knex = require('knex')(knexConfig) 

const createContent = async (contentData) => {
  return knex('content').insert(contentData).returning('*');
};

module.exports = {
  createContent,
};
