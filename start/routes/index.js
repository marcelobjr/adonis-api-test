'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { status: 'UP' }
})

/**
 * Import Auth Routes
 */
require('./auth')

/**
 * Import Users Routes
 */
require('./users')

/**
 * Import Admin Routes
 */
require('./admin')

/**
 * Import Client Routes
 */
 require('./client')
