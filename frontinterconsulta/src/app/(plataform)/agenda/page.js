'use client'
import Loading from "./loading"
import { Suspense } from 'react'
import { MainAgenda } from "@/app/components/MainAgenda"

const Agenda = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
        <MainAgenda/>
    </Suspense>
    </>
  )
}

export default Agenda