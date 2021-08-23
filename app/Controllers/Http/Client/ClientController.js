'use strict'

const Client = use('App/Models/Client')

const Transformer = use('App/Transformers/ClientTransformer')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with Clients
 */
class ClientController {
  /**
   * Show a list of all Clients.
   * GET Clients
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, transform }) {

    try {
      const client = await Client.all();
      response.send(client)
    } catch (err) {
      response.send(err)
    }
  }

  /**
   * Create/save a new company.
   * POST companies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {

    const mapClient = [
      'name',
      'email',
      'phone'
    ]

    const transaction = await Database.beginTransaction()
    try {
      let client = request.only(mapClient)

      client = await Client.create(client, transaction)

      await transaction.commit()
      return response
        .status(201)
        .send(await transform.item(client, Transformer))
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      return response.send(error)
    }
  }

  /**
   * Display a single client.
   * GET companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ response, params, transform }) {
    try {
      const client = await Client.findOrFail(params.id)
      return transform.item(client, Transformer)
    } catch (error) {
      return response.status(500).send({
        message: 'Customer not found!',
        error: error.message
      })
    }
  }

  /**
   * Render a form to update an existing company.
   * GET client/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update company details.
   * PUT or PATCH client/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
   async update({ params, request, response, auth, transform }) {

    const mapClient = request.only([
      'name',
      'email',
      'phone'
    ])

    try {
      let client = await Client.findOrFail(params.id)

      client.merge(mapClient)
      await client.save(client)

      return response.send(await transform.item(client, Transformer))
    } catch (e) {
      return response.status(500).send({
        message: 'Erro ao processar sua requisição!',
        error: e.message
      })
    }
  }


  /**
   * Delete a company with id.
   * DELETE companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      let client = await Client.findOrFail(params.id)

      await client.delete(client)

      return response.send()
    } catch (e) {
      return response.status(500).send({
        message: 'Erro ao processar sua requisição!',
        error: e.message
      })
    }

  }
}

module.exports = ClientController
