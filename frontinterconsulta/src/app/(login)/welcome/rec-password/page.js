'use client'
import { Suspense } from 'react'
import Loading from './loading.js'
import RecuperePassword  from '../../../components/RecuperePasswordd.jsx'


const RecPassword = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
      <RecuperePassword/>
    </Suspense>
    </>
  )
}

export default RecPassword