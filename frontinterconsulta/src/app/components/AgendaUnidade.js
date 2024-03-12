import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import secureLocalStorage from 'react-secure-storage'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import Link from 'next/link'

const PopUpUnidade = ({ NomeMedico, onClose, Status, unidadeName }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setOpen(false)
  }

  const getDialogTitle = () => {
    if (Status.includes('Confirmada')) {
      return `Consulta confirmada pelo ${NomeMedico}`
    } else if (Status.includes('Cancelada')) {
      return `Consulta Cancelada pelo ${NomeMedico}`
    } else if (Status.includes('Atendida')) {
      return `Consulta Atendida por ${NomeMedico}`
    } else {
      return `Aguardando Confirmaçao do ${NomeMedico}`
    }
  }

  const getDialogContent = () => {
    if (Status.includes('Confirmada')) {
      return (
        <p className='text-center'>
          Parabens {unidadeName}! sua consulta foi confirmada pelo {NomeMedico}{' '}
          clique no botao abaixo para iniciar a consulta
        </p>
      )
    } else if (Status.includes('Cancelada')) {
      return <p className='text-center'>{unidadeName} infelizmente sua consulta foi cancelada por {NomeMedico}</p>
    } else if (Status.includes('Atendida')) {
      return <p className='text-center'>{unidadeName} sua consulta ja foi atendida pelo {NomeMedico}</p>
    } else {
      return (
        <p className='text-center'>
          {unidadeName} {NomeMedico} ainda nao confirmou a a sua Consulta aguarde até o mesmo
          confirmar!
        </p>
      )
    }
  }

  const getDialogButton = () => {
    if (Status.includes('Confirmada')) {
      return (
        <button onClick={handleClose} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
          Iniciar Consulta com {NomeMedico}
        </button>
      )
    } else if (Status.includes('Cancelada')) {
      return (
        <Link href="/especialistas-disponiveis" onClick={handleClose}>
          <button className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
            Procurar Outros Médicos
          </button>
        </Link>
      )
    } else if (Status.includes('Atendida')) {
      return <button onClick={handleClose} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">Fechar</button>
    } else {
      return (
        <button onClick={handleClose} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
          Continuar Aguardando Confirmaçao {NomeMedico}
        </button>
      )
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
          <DialogTitle className='text-red-600 font-bold'>{getDialogTitle()}</DialogTitle>
          <DialogContent>{getDialogContent()}</DialogContent>
          {getDialogButton()}
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

export default PopUpUnidade
