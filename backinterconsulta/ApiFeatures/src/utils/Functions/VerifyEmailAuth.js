import { models } from '../../../MongoDB/Schemas/Schemas.js'

export const getUserByEmail = async (email, route) => {
  switch (route) {
    case '/welcome/login-medico':
       const Médico = await models.ModelRegisterMédico.findOne({ email })
       console.log(Médico)
       return Médico
    case '/welcome/login-paciente':
      return await models.ModelRegisterPaciente.findOne({ email })
    case '/welcome/login-unidade':
      return await models.ModelRegisterUnidadeSaude.findOne({ email })
    default:
      console.log('Rota para validar email do usuário para autenticação inválida');
      return null
  }
}
