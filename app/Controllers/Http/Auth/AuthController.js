'use strict'

const User = use('App/Models/User')
const Role = use('Role')
const Database = use('Database')
const PasswordReset = use('App/Models/PasswordReset')
const Collaborator = use('App/Models/Collaborator')
const Mail = use('Mail')
const Env = use('Env')

class AuthController {
  async register({ request, response }) {
    const trx = await Database.beginTransaction()

    try {
      const { name, phone, email, password } = request.all()

      const user = await User.create({ name, phone, email, password }, trx)

      // const userRole = await Role.findBy('slug', 'client')

      // Associa o userRole ao User
      // await user.roles().attach([userRole.id], null, trx)

      await trx.commit()
      return response.status(201).send({ data: user })
    } catch (e) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Erro ao realizar cadastro',
        message: e.message
      })
    }
  }

  async accessToken({ request, response, auth, transform }) {
    const { id, business_id } = await auth.getUser()
    const user = await User.findOrFail(id);
    return response.send({user})
  };

  async login({ request, response, auth, transform }) {
    const { email, password } = request.all()

    let data = await auth.withRefreshToken().attempt(email, password)
    data.user = await User.findByOrFail('email', request.input('email') );

    return response.send(data)
  }

  async refresh({ request, response, auth }) {
    const refresh_token = request.input('refresh_token')

    if (!refresh_token) {
      refresh_token = request.header('refresh_token')
    }

    const user = await auth
      .newRefreshToken()
      .generateForRefreshToken(refresh_token)

    return response.send(user)
  }

  async logout({ request, response, auth }) {
    let refresh_token = request.input('refresh_token')

    if (!refresh_token) {
      refresh_token = request.header('refresh_token')
    }

    const loggedOut = await auth
      .authenticator('jwt')
      .revokeTokens([refresh_token], true)

    return response.send()
  }

  async forgot({ request, response }) {
    const { email, language } = request.all()
    const user = await User.findByOrFail('email', email)
    const req = request
    try {
      /**
       * Invalida qualquer outro token que tenha sido gerado anteriormente
       */
      await PasswordReset.query()
        .where('email', user.email)
        .delete()

      /**
       * gera um novo token para reset da senha
       */
      const reset = await PasswordReset.create({ email: user.email })

      let subject = '';
      switch (language) {
        case 'br':
          subject = 'Solicitação de alteração de senha';
          break;
        case 'es':
          subject = 'Solicitud de cambio de contraseña';
          break;
        default:
          subject = 'Password change reques';
          break;
      }

      // Envia um novo e-mail para o Usuário, com um token para que ele possa alterar a senha
      await Mail.send(
        'emails.reset_' + language,
        { user, reset, referer: Env.get('FORGOT_URL') },
        message => {
          message
            .to(user.email)
            .from(Env.get('DO_NOT_ANSWER_EMAIL'))
            .subject(subject)
        }
      )

      return response.status(201).send({
        message:
          'Um e-mail com link para reset foi enviado para o endereço informado!'
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Ocorreu um erro inesperado ao executar a sua solicitação!'
      })
    }
  }

  async remember({ request, response }) {

    try {
      const reset = await PasswordReset.query()
        .where('token', request.params.token)
        //.where('expires_at', '>=', new Date())
        .firstOrFail()
        if(reset.expires_at >= new Date()) {
          const data = {
            'email': reset.email,
            'token': reset.token
          }
          return response.send(data)
        } else {
          return response.status(400).send({status: 'expired'})
        }
    } catch (error) {
      return response.status(400).send(error)
    }
    
  }

  async reset({ request, response }) {
    const { email, password } = request.all()
    const user = await User.findByOrFail('email', email)
    try {
      user.merge({ password })
      await user.save()
      /**
       * Invalida qualquer outro token que tenha sido gerado anteriormente
       */
      await PasswordReset.query()
        .where('email', user.email)
        .delete()
      return response.send({ message: 'Senha alterada com sucesso!' })
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Não foi possivel alterar a sua senha!' })
    }
  }
}

module.exports = AuthController
