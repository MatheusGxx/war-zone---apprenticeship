import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'

export const NotDateConsulta = ({ nomeMedico, TempoFaltando, onClose }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, []);

  const handleClose = () => {
    onClose()
    setOpen(false)
  };

  const handleImageError = (src) => {
    setError(true)
  }

  return (
    <>
      <Dialog open={open} className='p-10' key={nomeMedico}>
        <div className='flex flex-col justify-center items-center'>
          <div className='pt-6'>
            <Image
              src={Logo2}
              alt='Segundo Logo Interconsulta'
              width={200}
              height={100}
              onLoad={() => setLoading(false)}
              onError={() => handleImageError('Logo2')}
            />
            {loading && <div>Loading...</div>}
            {error && <div>Error loading image</div>}
          </div>
          <DialogTitle className='text-red-600 font-bold font-medium'>Atençao!!!</DialogTitle>
          <DialogContent className='text-center'>
            {TempoFaltando === 'Consulta Expirada' ? (
              <p>{nomeMedico} Infelizmente passou a data da sua consulta, e como consequencia disso ela infelizmente expirou =/</p>
            ) : (
              <p>{nomeMedico} Ainda nao esta no Horario da sua consulta faltam {Tempo
