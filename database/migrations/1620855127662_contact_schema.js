'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('email', 50)
      table.string('phone', 50)
      table.integer('category').defaultTo(0).index()

      table.uuid('user_id').notNullable().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')

      table.timestamps()
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactSchema
