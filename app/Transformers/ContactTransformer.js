'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const AddressTransformer = use('App/Transformers/AddressTransformer')

/**
 * CompanyTransformer class
 *
 * @class CompanyTransformer
 * @constructor
 */
class CompanyTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['address']
  }
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    model = model.toJSON()
    Object.entries(model).forEach(([key, val]) => {
      if (val === null) {
        model[key] = ''
      }
    })
    delete model.updated_at
    delete model.address_id
    return model
  }

  includeAddress(model) {
    return this.item(model.getRelated('address'), AddressTransformer)
  }
}

module.exports = CompanyTransformer
