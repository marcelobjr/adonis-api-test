'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/**
 * Admin Routes V1
 *
 * Prefix: /v1/admin
 */
Route.group(() => {
  /**
   * Contact Resource Routes
   */
  Route.resource('contact', 'ContactController').apiOnly().except('create')


})
  .middleware(['auth'])
  .prefix('v1/admin')
  .namespace('Admin')
