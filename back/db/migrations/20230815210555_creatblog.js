/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('blog', function(table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('Blogimage').notNullable();
        table.string('description').notNullable();
        table.string('url').notNullable();
        table.string('tags').notNullable();
        table.integer('content_id').unsigned();
        table.foreign('content_id').references('content.id'); 
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('blog'); 
    table.dropForeign('content_id');
    table.dropColumn('content_id');
};
