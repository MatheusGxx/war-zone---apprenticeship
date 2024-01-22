import { models } from '../../../MongoDB/Schemas/Schemas.js'
import { customAlphabet } from 'nanoid'

const alphabet = '0123456789';
const generateFourDigitNumber = customAlphabet(alphabet, 4);


export const SavedPaciente = async (CPF) => {
  try{
    const getPaciente = await models.ModelRegisterPaciente.findOne({ CPF: CPF})
    console.log(getPaciente)
    return getPaciente
  }catch(e){
    throw new Error
  }
}


export const CreatedAccountedPaciente = async (CPF,telefone,nome) =>{
  const newPasswordPaciente = generateFourDigitNumber()
  const criatedAccountednewPaciente = await new models.ModelRegisterMédico({
    nome: nome,
    CPF: CPF,
    senha: newPasswordPaciente,
    telefone: telefone
  })

  await criatedAccountednewPaciente.save()

  return criatedAccountednewPaciente
}