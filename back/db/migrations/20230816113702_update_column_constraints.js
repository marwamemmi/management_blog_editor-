/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('blog', function (table) {
        table.string('title').nullable().alter();
        table.string('Blogimage').nullable().alter();
        table.string('description').nullable().alter();
        table.string('url').nullable().alter();
        table.string('tags').nullable().alter();
        table.integer('content_id').unsigned().nullable().alter();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('blog', function (table) {
        table.string('title').notNullable().alter();
        table.string('Blogimage').notNullable().alter();
        table.string('description').notNullable().alter();
        table.string('url').notNullable().alter();
        table.string('tags').notNullable().alter();
        table.integer('content_id').unsigned().notNullable().alter();
      });
};
