'use client'
import Main from '../../components/Main.js'
import { Suspense } from 'react'
import Loading from './loading.js'
import ContentPaciente from '../../components/ContentPaciente.js'

const EspecialistasDisponiveis = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
    <Main title="Urgencia no Atendimento?" subTitle="Seja atendido por um especialista do #interconsulta agora!" Component={ContentPaciente}/>
    </Suspense>
  
    </>
  )
}

export default EspecialistasDisponiveis