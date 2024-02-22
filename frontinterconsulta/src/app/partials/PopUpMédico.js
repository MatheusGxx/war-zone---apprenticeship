'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'

function PopUpMédico() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true)
  }, []);

  const handleClose = () => {
    setOpen(false)
  };

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <div className='flex flex-col justify-center items-center'>
        <div className='pt-6'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
        </div>
          <DialogTitle className='text-red-600 font-bold'>Atençao!!!</DialogTitle>
          <DialogContent>
             <p className='font-bold'> Atençao para que nos do interconsulta possamos te remunerar é de extrema importancia e obrigatoriedade que voce preencha as informaçoes solicitadas ao lado!</p>
             <p className="font-bold">Observaçao: se o especialista nao fizer o que foi pedido acima, o mesmo nao sera remunerado</p>
          </DialogContent>
          <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
               <p className="whitespace-nowrap">Eu entendo e irei preencher os dados.</p>
            </button>
        </div>
       <div className="flex justify-end p-4">
            <Image
              src={Logo}
              alt="Logo Interconsulta"
              height={40}
              width={40}
              className='animate-spin-slow'
            />
          </div>
      </Dialog>
    </>
  );
}

export default PopUpMédico
