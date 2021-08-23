'use strict'

const Contact = use('App/Models/Contact')

const Transformer = use('App/Transformers/ContactTransformer')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class ContactController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, auth, transform, pagination }) {
    const { user_id } = await auth.getUser()

    try {
      const companies = await Company.query().where(
        'business_id',
        business_id
      ).paginate(pagination.page, pagination.perpage)

      response.send(await transform.paginate(companies, Transformer))
    } catch (err) {
      console.log(err)
      response.send({ err })
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
  async store({ request, response, auth, transform }) {
    const { business_id } = await auth.getUser()

    const mapCompany = [
      'name',
      'razao_social',
      'cnpj',
      'ie',
      'im',
      'dominio',
      'phone',
      'category'
    ]
    const mapAddress = request.only(['address'])

    const transaction = await Database.beginTransaction()
    try {
      let company = request.only(mapCompany)

      const address = await Address.create(mapAddress.address, transaction)

      company.address_id = address.id
      company.business_id = business_id

      company = await Company.create(company, transaction)

      await transaction.commit()
      return response
        .status(201)
        .send(await transform.item(company, Transformer))
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      return response.send({error})
    }
  }

  /**
   * Display a single company.
   * GET companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ response, params, transform }) {
    try {
      const company = await Company.findOrFail(params.id)
      return transform.item(company, Transformer)
    } catch (error) {
      return response.status(500).send({error})
    }
  }

  /**
   * Render a form to update an existing company.
   * GET companies/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update company details.
   * PUT or PATCH companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
   async update({ params, request, response, auth, transform }) {
    const { business_id } = await auth.getUser()
    const mapCompany= request.only([
      'id',
      'name',
      'razao_social',
      'cnpj',
      'ie',
      'im',
      'dominio',
      'phone',
      'category',
      'business_id'
    ])
    const mapAddress = request.only(['address'])

    const transaction = await Database.beginTransaction()
    try {
      const company = await Company.findOrFail(mapCompany.id)
      if (mapCompany.business_id != business_id) {
        return response.status(401).send({})
      }
      company.merge(mapCompany)
      await company.save(transaction)

      const address = await Address.findOrFail(mapAddress.address.id)
      delete mapAddress.address.id
      address.merge(mapAddress.address)
      await address.save(transaction)

      await transaction.commit()
      return response.send(await transform.item(company, Transformer))
    } catch (e) {
      await transaction.rollback()
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
  async destroy({ params, request, response }) {}
}

module.exports = ContactController
