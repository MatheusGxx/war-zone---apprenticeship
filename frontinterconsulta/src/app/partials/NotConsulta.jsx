import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'

export const NotDateConsulta = ({nomeMedico, TempoFaltando, onClose}) => {
  
    const[open,setOpen] = useState(false)
    useEffect(() => {
      setOpen(true)
    }, []);

  const handleClose = () => {
    onClose()
    setOpen(false)
  };

  return(
    <>
      <Dialog open={open}  className='p-10'>
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
            {TempoFaltando === 'Consulta Expirada' ? 
            <p>{nomeMedico} Infelizmente passou a data da sua consulta, e como consequencia disso ela infelizmente expirou =/</p> : 
            <p>{nomeMedico} Ainda nao esta no Horario da sua consulta faltam {TempoFaltando} minutos, para a sua consulta</p>
            }
          </DialogContent>
          <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
               <p className="whitespace-nowrap">Voltar pra Agenda</p>
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