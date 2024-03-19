'use client'
import MainUnidade from '../../components/MainUnidade.js'
import Loading from './loading.js'
import { Suspense } from 'react'
import ContentUnidade from '../../components/ContentUnidade.js'

const  UnidadeEspecialista = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
    <MainUnidade title="Gestão Integrada Descentralizada da Saúde" subTitle="Dimensione a equipe médica e tenha total controle dos agendamentos em suas mãos" Component={ContentUnidade}/>
    </Suspense>
    </>
  )
}

export default UnidadeEspecialista