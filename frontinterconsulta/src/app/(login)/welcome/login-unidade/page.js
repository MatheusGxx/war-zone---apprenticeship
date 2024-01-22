'use client'
import Login from '../../../components/Login.js'
import ImagemLateralEmpresa from '../../../public/ImageLogin.png'
import { Suspense } from 'react'
import Loading from './loading.js'

const LoginUnidade = () =>{
  return(
    <>
        <Suspense fallback={Loading} >
          <Login ImagemLateral={ImagemLateralEmpresa} title="Ola Unidade de Saude" MessageButton="Ache Médicos agora" secondRoute="/login-unidade" treeRoute="/cadastro-unidade" plataform="/unidade-especialista" apelido="Unidade"/>
        </Suspense>
    </>
  )
}

export default LoginUnidade 