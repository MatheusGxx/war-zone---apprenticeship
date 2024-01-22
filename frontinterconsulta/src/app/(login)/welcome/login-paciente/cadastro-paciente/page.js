'use client'
import Cadastro from '../../../../components/Cadastro.js'

const CadastroPaciente = () => {
  return(
    <>
    <Cadastro title="Cadastre-se para ser Atendido!"  OneRoute="/login-paciente" SecondRoute="/cadastro-paciente" TreeRoute="/obrigado-paciente" apelido="Paciente" mensagem="Voce esta muito perto de ser Atendido por um dos médicos do Interconsulta"/>
    </>
  )
}

export default CadastroPaciente

