'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import { useRouter, useSearchParams } from 'next/navigation'

export const NotLogged = ({ messageOne, messageTwo, onClose}) => {
  const [open, setOpen] = useState(false)
  const [okUTM, setOkUTM] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])
  
  const params = useSearchParams()

  const referrer = params.get('UTM_Referrer') 
  const funil = params.get('UTM_Funil') 
  const temp = params.get('UTM_Temp')  
  const rota = params.get('UTM_Rota')
  const source = params.get('UTM_Source') 
  const medium = params.get('UTM_Medium') 
  const campaign = params.get('UTM_Campaign') 
  const term = params.get('UTM_Term') 
  const content = params.get('UTM_Content')  

  useEffect(() => {
    if(referrer && funil && temp && rota && source && medium && campaign && term && content){
      setOkUTM(true)
    }

  },[okUTM])

  const Router = useRouter()

  const handleClose = () => {
    if(onClose){
      onClose()
    }
    setOpen(false)
  }

  const HandleCloseButton = () =>{
    setOpen(false)
    if(okUTM){
      Router.push(`/welcome?UTM_Referrer=${encodeURIComponent(referrer)}&UTM_Funil=${encodeURIComponent(funil)}&UTM_Temp=${encodeURIComponent(temp)}&UTM_Rota=${encodeURIComponent(rota)}&UTM_Source=${encodeURIComponent(source)}&UTM_Medium=${encodeURIComponent(medium)}&UTM_Campaign=${encodeURIComponent(campaign)}&UTM_Term=${encodeURIComponent(term)}&UTM_Content=${encodeURIComponent(content)}`)
    }else{
      Router.push('/welcome')
    }
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

