import { useState } from 'react'
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  Typography,
  InputAdornment
} from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const RegisterFiveDoctor = ({
  setPrecoConsulta,
  precoConsulta,
  setNomeTitular,
  nometitular,
  setNumeroConta,
  numeroconta,
  setNumeroAgencia,
  numeroAgencia,
  setBanco,
  banco,
  setPix,
  pix,
  setCurrentStep
}) => {
  const [errors, setErrors] = useState([])

  const handleNextClick = () => {
    const newErrors = []

    if (!precoConsulta) {
      newErrors.push('Preço da Consulta por Telemedicina')
    }
    if (!nometitular) {
      newErrors.push('Nome do Titular da Conta')
    }
    if (!numeroconta) {
      newErrors.push('Número da sua conta')
    }
    if (!numeroAgencia) {
      newErrors.push('Número da sua agência')
    }
    if (!banco) {
      newErrors.push('Seu Banco')
    }
    if (!pix) {
      newErrors.push('Sua Chave Pix')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setCurrentStep((prevStep) => (prevStep < 6 ? prevStep + 1 : prevStep))
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  return (
    <>
      <h1 className="text-blue-500 text-center"> Preferências de Pagamento </h1>

      <TextField
        variant="standard"
        label="Preço da Consulta por Telemedicina"
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          sx: { borderBottom: '1px solid blue' }
        }}
        type="number"
        required
        error={!!errors.includes('Preço da Consulta por Telemedicina')}
        helperText={errors.includes('Preço da Consulta por Telemedicina') && 'Campo obrigatório'}
        onChange={(e) => setPrecoConsulta(e.target.value)}
        value={precoConsulta}
      />

      <TextField
        variant="standard"
        label="Nome do Titular da conta"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="text"
        required
        error={!!errors.includes('Nome do Titular da Conta')}
        helperText={errors.includes('Nome do Titular da Conta') && 'Campo obrigatório'}
        onChange={(e) => setNomeTitular(e.target.value)}
        value={nometitular}
      />

      <TextField
        variant="standard"
        label="Número da sua conta"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="number"
        required
        error={!!errors.includes('Número da sua conta')}
        helperText={errors.includes('Número da sua conta') && 'Campo obrigatório'}
        onChange={(e) => setNumeroConta(e.target.value)}
        value={numeroconta}
      />

      <TextField
        variant="standard"
        label="Número da sua agência"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="number"
        required
        error={!!errors.includes('Número da sua agência')}
        helperText={errors.includes('Número da sua agência') && 'Campo obrigatório'}
        onChange={(e) => setNumeroAgencia(e.target.value)}
        value={numeroAgencia}
      />

      <TextField
        variant="standard"
        label="Seu Banco"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="text"
        required
        error={!!errors.includes('Seu Banco')}
        helperText={errors.includes('Seu Banco') && 'Campo obrigatório'}
        onChange={(e) => setBanco(e.target.value)}
        value={banco}
      />

      <TextField
        variant="standard"
        label="Sua chave Pix"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="number"
        required
        error={!!errors.includes('Sua Chave Pix')}
        helperText={errors.includes('Sua Chave Pix') && 'Campo obrigatório'}
        onChange={(e) => setPix(e.target.value)}
        value={pix}
      />

      <div className="w-full flex justify-between items-center">
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<ArrowBackIosIcon />}
          onClick={handleBackClick}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNextClick}
        >
          Próximo
        </Button>
      </div>

      {errors.length > 0
