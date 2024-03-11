import {
  ModelRegisterMédico,
  ModelRegisterPaciente,
  ModelRegisterUnidadeSaude,
} from '../../../MongoDB/Schemas/Schemas.js';

export const getUserByEmail = async (email, route) => {
  try {
    let User;
    switch (route) {
      case '/welcome/login-medico':
        User = ModelRegisterMédico;
        break;
      case '/welcome/login-paciente':
        User = ModelRegisterPaciente;
        break;
      case '/welcome/login-unidade':
        User = ModelRegisterUnidadeSaude;
        break;
      default:
        console.log(
          'Rota para validar email do usuário para autenticação inválida'
        );
        return null;
    }
    const user = await User.findOne({ email });
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error while finding user by email:', error);
    return null;
  }
};
