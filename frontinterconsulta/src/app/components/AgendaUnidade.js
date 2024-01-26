'use client'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import secureLocalStorage from 'react-secure-storage'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import Link from 'next/link'
import { config } from '../config.js'

export const PopUpUnidade = ({ NomeMedico, onClose, Status}) => {

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, []);

  const handleClose = () => {
    if(onClose()){
      onClose()
    }
    setOpen(false)
  }

  const NomeUnidadeLocal = secureLocalStorage.getItem('NomeUnidade')
  const NomeUnidade = NomeUnidadeLocal || ''
  
  return(
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
          <DialogTitle className='text-red-600 font-bold'>
             {Status.includes('Confirmada') ? 
             `Consulta confirmada pelo ${NomeMedico}` :
              Status.includes('Cancelada') ?
              `Consulta Cancelada pelo ${NomeMedico}`:
              Status.includes('Atendida') ?
              `Consulta Atendida por ${NomeMedico}` :
              `Aguardando Confirmaçao do ${NomeMedico}`}
            </DialogTitle>
          <DialogContent>

          {Status.includes('Confirmada') ?
           <p className='text-center'> Parabens {NomeUnidade}! sua consulta foi confirmada pelo {NomeMedico} clique no botao abaixo para iniciar a consulta </p>  :
           Status.includes('Cancelada') ?
           <p className='text-center'>{NomeUnidade} infelizmente sua consulta foi cancelada por {NomeMedico} </p> :
           Status.includes('Atendida') ?
           <p className='text-center'>{NomeUnidade} sua consulta ja foi atendida pelo {NomeMedico}</p> :
           <p className='text-center'> {NomeUnidade} {NomeMedico} ainda nao confirmou a sua Consulta aguarde até o mesmo confirmar! </p>
          }
          
         
          </DialogContent>
          <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
             {Status.includes('Confirmada') ? 
             `Iniciar Consulta com ${NomeMedico}` :
              Status.includes('Cancelada') ?
              <Link href='/especialistas-disponiveis'>
               Procurar Outros Médicos
              </Link> :
              Status.includes('Atendida') ?
              'Fechar':
               ` Continuar Aguardando Confirmaçao ${NomeMedico}`}
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
