'use strict'

const Perfil = use('App/Models/Perfil')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/**
 * Resourceful controller for interacting with perfils
 */
class PerfilController {
  /**
   * Show a list of all perfils.
   * GET perfils
   *
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {auth} ctx.auth
   */
  async index({ request, response, auth }) {
    const user = await auth.getUser()

    try {
      const perfil = await Perfil.findBy('user_id', user.id)
      if (perfil == null) {
        const newPerfil = new Perfil()
        newPerfil.merge({user_id: user.id })
        await newPerfil.save()
        response.send({ perfil: newPerfil })
      } else {
        response.send({ perfil })
      }
      
    } catch (err) {
      console.log(err)
      response.send({ err })
    }
  }

  /**
   * Create/save a new perfil.
   * POST perfils
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Update perfil details.
   * PUT or PATCH perfils/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a perfil with id.
   * DELETE perfils/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = PerfilController
