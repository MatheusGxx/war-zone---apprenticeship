import { VerifyDataMédico, VefiryDataUnidade, VerifyDataPaciente } from '../zodVerify.js'
 
export const VefiryData = async (route, dataMedico, dataPaciente, dataUnidade) =>{

  switch(route){
    case '/welcome/login-medico/cadastro-medico/obrigado-medico':
       VerifyDataMédico.parse(dataMedico)
       console.log('Schema Validado')
       break
    case '/welcome/login-paciente/cadastro-paciente/obrigado-paciente':
      VerifyDataPaciente.parse(dataPaciente)
      console.log('Schema Validado')
      break
    case '/welcome/login-unidade/cadastro-unidade/obrigado-unidade':
      VefiryDataUnidade.parse(dataUnidade)
      console.log('Schema Validado')
      break
  }
}