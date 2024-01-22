'use client'
import MainUnidade from '../../components/MainUnidade.js'
import Loading from './loading.js'
import { Suspense } from 'react'
import ContentUnidade from '../../components/ContentUnidade.js'

const  UnidadeEspecialista = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
    <MainUnidade title="Gestão Integrada de Recursos" subTitle="Baixe a nossa planilha que nos encontramos o que voce precisa para voce!" Component={ContentUnidade}/>
    </Suspense>
    </>
  )
}

export default UnidadeEspecialista