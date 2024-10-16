
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'


export const PopUpAviso = ({NomeMedico, Unidade}) => {

  const[open,setOpen] = useState(false)
  useEffect(() => {
    // Abra o pop-up quando o componente for montado
    setOpen(true)
  }, []);

  const handleClose = () => {
    // Feche o pop-up
    setOpen(false)
  };

  return(
    <>
      <Dialog open={open} className='p-10'>
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
              <p>{NomeMedico} Voce escolheu um caso Clinico do Solicitante {Unidade} Logo voce só podera escolher casos clinicos dele, caso queria ir para outra Unidade de Saude/Solicitante desmarque os Casos do Solicitante {Unidade} que voce escolheu Anteriormente</p>
          </DialogContent>
          <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
               <p className="whitespace-nowrap">Fechar</p>
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
  )
}