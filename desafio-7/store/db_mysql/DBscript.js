const { config } = require('./config.js')
const knex = require('knex')(config)

async function DBscript() {
  try {
    await knex.schema.dropTableIfExists('products')
    

    await knex.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.string('title', 100).notNullable()
      table.decimal('price').notNullable()
      table.string('thumbnail', 200).notNullable()
    })

    console.log('tabla creada')
  } catch (error) {
    console.error(error)
  } finally {
    knex.destroy()
  }
}

module.exports = { DBscript }