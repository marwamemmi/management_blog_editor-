// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  client: 'postgresql',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '28805090',
    database: 'blogs',
    port: 5000,
},
migrations: {
  directory: './migrations', // Change this path to your migrations directory
},
seeds: {
  directory: './seeds', // Change this path to your seeds directory
},
pool: {
  "min": 0,
      "max": 10,
       "idleTimeoutMillis": 30000,
       "createTimeoutMillis": 30000,
       "acquireTimeoutMillis": 30000
}

};
