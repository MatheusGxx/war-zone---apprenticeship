import bcrypt from 'bcrypt'

export const Criptografia = async (dados) =>{
  try{
    const salt = await bcrypt.genSalt()

    const DadosCriptografados = await bcrypt.hash(dados, salt)
  
    return DadosCriptografados
  }catch(err){
    return console.log(err)
  }
}