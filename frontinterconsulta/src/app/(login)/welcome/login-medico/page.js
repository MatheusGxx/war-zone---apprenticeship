'use client'

import Login from '../../../components/Login.js'

import ImagemLateralMédico from '../../../public/ImageLogin.png'
import { Suspense } from 'react'
import Loading from './loading.js'

const LoginMédico = () =>{
  return(
    <>
      <Suspense fallback={Loading}>
        <Login ImagemLateral={ImagemLateralMédico} title="Ola Dr(a)" MessageButton="Salve uma vida" secondRoute="/login-medico" treeRoute="/cadastro-medico" plataform="/agenda" apelido="Dr(a)"/>
      </Suspense>
    </>
  )
} 

export default LoginMédico

