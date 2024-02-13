'use client'

import Login from '../../../components/Login.js'
import ImagemLateralPaciente from '../../../public/ImageLogin.png'
import Loading from './loading.js'
import { Suspense } from 'react'


const LoginPaciente = () => {
  return(
    <>
      <Suspense fallback={Loading}>
        <Login ImagemLateral={ImagemLateralPaciente} title="Ola Paciente" MessageButton="Seja Atendido agora!" secondRoute="/login-paciente" treeRoute="/cadastro-paciente" plataform="/especialistas-disponiveis" apelido="Paciente"/>
      </Suspense>
    </>
  )
}

export default LoginPaciente