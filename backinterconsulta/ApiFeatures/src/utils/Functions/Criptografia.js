import bcrypt from 'bcrypt'


export const Criptografia = async (dados) =>{
  const salt = await bcrypt.genSalt()

  const DadosCriptografados = await bcrypt.hash(dados, salt)

  return DadosCriptografados
}