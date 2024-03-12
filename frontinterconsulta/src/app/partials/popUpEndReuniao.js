import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import secureLocalStorage from 'react-secure-storage'
import { config } from '../config.js'

export const PopUpEndReunião = ({PersonaNaoclicou, onClose}) => {


  const NomeLocalPaciente = secureLocalStorage.getItem('NomePaciente')
  const NomePaciente =  NomeLocalPaciente || ''

  const NomeLocalMedico = secureLocalStorage.getItem('NomeMedico')
  const NomeMedico =  NomeLocalMedico || ''
  
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
            <DialogTitle className='text-red-600 font-bold'>Atençao {
              NomePaciente ? NomePaciente : NomeMedico ? NomeMedico : ''
            }</DialogTitle>
            <DialogContent>
              <p className='font-bold'>O {PersonaNaoclicou} nao clicou em finalizar a consulta, avise - o para clicar em finalizar para que ambos possam terminar a consulta!</p>
            </DialogContent>
            <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
                <p className="whitespace-nowrap">Okay vou avisar</p>
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