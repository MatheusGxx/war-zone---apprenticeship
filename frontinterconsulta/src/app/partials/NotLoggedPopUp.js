'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import { useRouter } from 'next/navigation'

export const NotLogged = ({ messageOne, messageTwo, onClose}) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])
  

  const Router = useRouter()

  const handleClose = () => {
    if(onClose){
      onClose()
    }
    setOpen(false)
  }

  const HandleCloseButton = () =>{
    setOpen(false)
    Router.push('/welcome')
  }
 
  return (
    <>
    <Dialog open={open} onClose={handleClose} className='p-10'>
      <div className='flex flex-col justify-center items-center'>
        <div className='pt-6'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
        </div>
          <DialogTitle className='text-red-600 font-bold'>{messageOne}</DialogTitle>
          <DialogContent>
              <h1 className='font-bold text-black text-center'>{messageTwo}</h1>
          </DialogContent>
          <button onClick={() => HandleCloseButton()} className="w-72 h-12 rounded-full bg-red-600 text-white font-bold">
               Fazer Login
            </button>
        </div>
       <div className="flex justify-end p-4">
            <Image
              src={Logo}
              alt="Logo Interconsulta"
              height={40}
              width={40}
            />
          </div>
      </Dialog>
    </>
  );
}

