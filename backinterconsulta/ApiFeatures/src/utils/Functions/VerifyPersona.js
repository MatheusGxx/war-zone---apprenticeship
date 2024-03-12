import { VerifyDataMedico, VerifyDataUnidade, VerifyDataPaciente } from '../zodVerify.js';

export const verifyDataMedico = (dataMedico) => {
  VerifyDataMédico.parse(dataMedico);
  console.log('Schema Validado');
};

export const verifyDataPaciente = (dataPaciente) => {
  VerifyDataPaciente.parse(dataPaciente);
  console.log('Schema Validado');
};

export const verifyDataUnidade = (dataUnidade) => {
  VefiryDataUnidade.parse(dataUnidade);
  console.log('Schema Validado');
};

export const VefiryData = (route, dataMedico, dataPaciente, dataUnidade) => {
  switch (route) {
    case '/welcome/login-medico/cadastro-medico/obrigado-medico':
      verifyDataMedico(dataMedico);
      break;
    case '/welcome/login-paciente/cadastro-paciente/obrigado-paciente':
      verifyDataPaciente(dataPaciente);
      break;
    case '/welcome/login-unidade/cadastro-unidade/obrigado-unidade':
      verifyDataUnidade(dataUnidade);
      break;
    default:
      throw new Error(`Invalid route: ${route}`);
  }
};
