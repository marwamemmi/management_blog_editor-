/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('blog', function (table) {
      table.integer('content_id').unsigned();
      table.foreign('content_id').references('content.id');
    });
  };
  
 
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('blog', function (table) {
      table.dropForeign('content_id');
      table.dropColumn('content_id');
    });
  };
