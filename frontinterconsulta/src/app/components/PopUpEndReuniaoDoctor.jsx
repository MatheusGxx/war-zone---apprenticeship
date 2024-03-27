'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from 'next/image'
import { config } from '../config.js'

export const EndReuniaoDoctor = ({ nomeDoctor }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
      setOpen(true)
    }, [])
  
    const handleClose = () => {
      setOpen(false)
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
            <DialogTitle className='text-red-600 font-bold'> {nomeDoctor} A consulta acabou! </DialogTitle>
            <DialogContent>
               <p className='font-bold'> {nomeDoctor} a consulta acabou e o paciente automaticamente foi direcionado para a pagina de avaliaçao para te avaliar, por favor antes de clicar para sair da Reuniao, preencha todos os campos obrigatórios em relaçao a sua consulta com o Paciente</p>
            </DialogContent>
            <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
                 <p className="whitespace-nowrap">Ok vou preencher os dados </p>
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