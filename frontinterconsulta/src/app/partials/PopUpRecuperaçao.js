'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from 'next/image'

const PopUpRecuperacao = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const searchParams = useSearchParams()
  const persona = searchParams.get('persona')

  const handleClickEnd = async () => {
    setLoading(true)
    setError(false)
    setErrorMessage('')

    try {
      // Request of data in APIRestFull
      // Replace with actual API request
      const response = await fetch('/api/send-data', {
        method: 'POST',
        body: JSON.stringify({ name, email, telefone, persona }),
      })

      if (!response.ok) {
        throw new Error('Failed to send data')
      }

      handleClose()
    } catch (error) {
      setError(true)
      setErrorMessage('Failed to send data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setName('')
    setEmail('')
    setTelefone('')
  }

  useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <>
      <Dialog open={open} onClose={handleClose} className="p-10">
        <div className="flex flex-col justify-center">
          <DialogTitle>
            <Image
              src={Logo2}
              alt="Logo 2 Interconsulta"
              height={200}
              width={220}
            />
          </DialogTitle>
          {persona === 'medico' && (
            <DialogTitle className="text-center"> Não Saia Dr(a)
              <SentimentVeryDissatisfiedIcon />
            </DialogTitle>
          )}
          {persona === 'paciente' && (
            <DialogTitle className="text-center"> Não Saia Paciente
              <SentimentVeryDissatisfiedIcon />
            </DialogTitle>
          )}
          {persona === 'unidade' && (
            <DialogTitle className="text-center"> Não Saia Unidade
              <SentimentVeryDissatisfiedIcon />
            </DialogTitle>
          )}
          {(persona !== 'medico' && persona !== 'paciente' && persona !== 'unidade') && (
            <DialogTitle className="text-center"> Fique por dentro! </DialogTitle>
          )}
        </div>
        <DialogContent>
          <div className="flex flex-col gap-5">
            <TextField
              variant="standard"
              label="Seu Nome"
              InputProps={{
                sx: { borderBottom: '1px solid blue' },
              }}
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              error={error}
              helperText={errorMessage}
            />
            <TextField
              variant="standard"
              label="Seu Melhor email"
              InputProps={{
                sx: { borderBottom: '1px solid blue' },
              }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              error={error}
              helperText={errorMessage}
            />
            <TextField
              variant="standard"
              label="Telefone para contato"
              InputProps={{
                sx: { borderBottom: '1px solid blue' },
              }}
              onChange={(e) => setTelefone(e.target.value)}
              value={telefone}
              type="number"
              required
              error={error}
              helperText={errorMessage}
            />
          </div>
          {loading && (
            <LinearProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickEnd}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Enviar
          </Button>
        </DialogActions>
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
  )
}

export default PopUpRecuperacao
