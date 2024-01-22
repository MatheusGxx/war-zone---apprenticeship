'use client'
import Logo from '../../../public/logo.png'
import Logo2 from '../../../public/Logo2.png'
import Image from 'next/image'
import { TextField } from '@mui/material'
import IconBack from '../../../partials/IconBack.js'
import { Suspense } from 'react'
import Loading from './loading.js'


const RecPassword = () =>{
  return(
    <>
    <Suspense fallback={Loading}>
      <div className='container'>
      <div className='pl-10 relative top-10'>
          <IconBack />
        </div>
        <section className="flex flex-col gap-11 justify-center items-center sm:gap-8 lg:gap-10 -mt-4">
            <Image
              src={Logo}
              alt='Logo Interconsulta'
              height={150}
              width={150}
              className='animate-spin-slow'
            />
          <h1 className='text-blue-600 text-3xl'>Recuperar Senha</h1>
           <TextField id="standard-basic" label="Email" variant="standard" sx={{ width: '300px'}} type="email" required/>
           <TextField id="standard-basic" label="Sua Nova Senha" variant="standard" sx={{ width: '300px'}} type='password' required/>
           <TextField id="standard-basic" label="Confirme a sua Nova Senha" variant="standard" sx={{ width: '300px'}} type='password' required/>
           <button className='w-72 h-12 rounded-full bg-indigo-950 text-white font-light'> Recuperar Senha </button>
            <Image
            src={Logo2}
            alt="Logo 2 Interconsulta"
            height={200}
            width={220}
            />
        </section>
      </div>
    </Suspense>
    </>
  )
}

export default RecPassword