'use client'
import MainUnidade from '../../components/MainUnidade.js'
import Loading from './loading.js'
import { Suspense } from 'react'
import ContentUnidade from '../../components/ContentUnidade.js'

const  UnidadeEspecialista = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
    <MainUnidade title="Gestão Integrada de Recursos" subTitle="Gestor, baixe sua planilha de exemplo aqui!" Component={ContentUnidade}/>
    </Suspense>
    </>
  )
}

export default UnidadeEspecialista