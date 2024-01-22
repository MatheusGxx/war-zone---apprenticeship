'use client'
import Cadastro from '../../../../components/Cadastro.js'

const CadastroMédico = () =>{
  return(
    <>
   <Cadastro title="Cadastre-se abaixo Dr(a)" OneRoute="/login-medico" SecondRoute="/cadastro-medico" TreeRoute="/obrigado-medico" apelido="Dr(a)" mensagem="Voce esta muito Proximo de se tornar um Médico Oficial do Interconsulta"/>
    </>
  )
}
export default CadastroMédico