'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/**
 * Auth Routes used for admins and users
 */
Route.group(() => {
  Route.resource('perfil', 'PerfilController')
    .apiOnly()
    .except('show')
    .except('update')
    .except('create')
    .except('destroy')
})
  .middleware(['auth'])
  .prefix('v1/users')
  .namespace('Users')
