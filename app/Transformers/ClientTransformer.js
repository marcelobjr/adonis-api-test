'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ClientTransformer class
 *
 * @class ClientTransformer
 * @constructor
 */
class ClientTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (client) {
    client = client.toJSON()
    Object.entries(client).forEach(([key, val]) => {
      if (val === null) {
        client[key] = '';
      }
    })
    return client
  }
}

module.exports = ClientTransformer
