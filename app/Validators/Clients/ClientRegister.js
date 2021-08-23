'use strict'

class ClientRegister {
    get rules() {
        return {
            name: 'required',
            phone: 'required',
            email: 'required|email|unique:users,email',
            password: 'required|confirmed'
        }
    }
}

module.exports = ClientRegister
