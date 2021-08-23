'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends TransformerAbstract {
    defaultInclude() {
        return ['image']
    }
    /**
     * This method is used to transform the data.
     */
    transform(user) {
        user = user.toJSON()
        Object.entries(user).forEach(([key, val]) => {
            if (val === null) {
              user[key] = '';
            }
          })
        delete user.updated_at
        delete user.image_id
        return user
    }

    includeImage(user) {
        return this.item(user.getRelated('image'), ImageTransformer)
    }
}

module.exports = UserTransformer
