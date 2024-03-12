'use client'

import Cadastro from '../../../../components/Cadastro.js'

const CadastroUnidade = () =>{
  return(
    <>
    <Cadastro title="Cadastre-se e ache especialistas!"  OneRoute="/login-unidade" SecondRoute="/cadastro-unidade" TreeRoute="/obrigado-unidade" apelido="Unidade" mensagem="Voce esta muito proximo a resolver todos os casos Clinicos do seu Hospital"/>
    </>
  )
}
export default CadastroUnidade