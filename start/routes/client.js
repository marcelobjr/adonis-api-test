'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/**
 * Test Routes V1
 *
 * Prefix: /v1/client
 */
Route.group(() => {
  /**
   * Client Resource Routes
   */
  Route.resource('client', 'ClientController').apiOnly().except('create')


})
  .prefix('v1')
  .namespace('Client')
