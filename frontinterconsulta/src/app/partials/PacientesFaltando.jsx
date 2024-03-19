'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/LogoInterGestão.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  
export const PacienteFaltando = ({ NomeUnidade, QuantidadePacientesFaltando, Pacientes, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true)
  }, []);

  const handleClose = () => {
    onClose()
    setOpen(false)
  }

  return (
    <>
    <Dialog 
     open={open}
     onClose={handleClose}
     PaperProps={{
        style: {
          maxWidth: '1250px', 
          width: '100%',
        },
      }}
     >
      <div className='flex flex-col justify-center items-center'>
        <div className='pt-6'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
        </div>
          <DialogTitle className='text-red-600 font-bold'> { NomeUnidade } Segue os seus { QuantidadePacientesFaltando } Pacientes que ficaram faltando para suprir a sua demanda </DialogTitle>
          <DialogContent>
            {Pacientes.map((data, index) => {
                return (
                  <div key={index} className='flex gap-3'>
                    <AccountCircleIcon color="primary" fontSize='large'/>
                    <p className=''> <span className='font-bold text-blue-500'> Nome do Paciente: </span> {data.NomePaciente}</p>
                    <p className=''> <span className='font-bold text-blue-500'> CPF: </span> {data.CPF}</p>
                  </div>
                )
  
            })}
          </DialogContent>
          <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
               <p className="whitespace-nowrap"> Fechar </p>
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
