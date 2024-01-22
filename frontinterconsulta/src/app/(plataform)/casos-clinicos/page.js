'use client'
import MainMedico from '../../components/MainMedico.js'
import Loading from './loading.js'
import { Suspense } from 'react'
import ContentMédico from '../../components/ContentMédico.js'

const CasosClinicos = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
    <MainMedico title="Quer mais atendimentos particulares?" subTitle="aqui no  #interconsulta nos triamos e encaminhamos o atendimento pra voce!" Component={ContentMédico}/>
    </Suspense>
   
    </>
  )
}

export default CasosClinicos