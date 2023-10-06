/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('content', function(table) {
      table.increments('id').primary();
      table.string('image');
      table.text('content');
      table.string('url1');
      table.integer('blog_id').unsigned();
      table.foreign('blog_id').references('blog.id').onDelete('CASCADE');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable('content');
};
