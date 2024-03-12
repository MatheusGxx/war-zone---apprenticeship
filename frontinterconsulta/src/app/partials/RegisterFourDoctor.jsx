import { useState } from 'react'
import {
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
  Button,
  Typography
} from '@mui/material'
import { CertificacoesEndocanabinoide } from './CertificacaoEndocanabinoide.js'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'

const validateForm = (formacao, anograduacao, crm, ufCRM) => {
  const errors = []

  if (!formacao) {
    errors.push('Instituição da formação médica é obrigatório.')
  }

  if (!anograduacao) {
    errors.push('Ano da formação médica é obrigatório.')
  }

  if (!crm) {
    errors.push('CRM é obrigatório.')
  }

  if (!ufCRM) {
    errors.push('UF do CRM é obrigatório.')
  }

  return errors
}

export const RegisterFourDoctor = ({
  setFormacao,
  formacao,
  setAnoGraduacao,
  anograduacao,
  setCRM,
  crm,
  setUFCRM,
  ufCRM,
  setInstituicaoResidencia,
  instituicaoResidencia,
  setRQE,
  rqe,
  setPosGraduacao,
  posGraduacao,
  certificacao,
  setCertificacao,
  setCurrentStep
}) => {
  const [errors, setErrors] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleNextClick = () => {
    const validationErrors = validateForm(formacao, anograduacao, crm, ufCRM)
    setErrors(validationErrors)

    if (validationErrors.length === 0) {
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep))
    }
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/

  const handleData = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    const formattedValue = value.replace(regex, '$1/$2/$3')
    setAnoGraduacao(formattedValue)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  return (
    <>
      <h1 className="text-blue-500 text-center">Formação Médica</h1>
      <TextField
        variant="standard"
        label="Instituição da formação médica"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="text"
        required
        onChange={(e) => setFormacao(e.target.value)}
        value={formacao}
        error={!!errors.find((error) => error.includes('Instituição'))}
        helperText={errors.find((error) => error.includes('Instituição'))}
      />

      <TextField
        variant="standard"
        label="Ano da formação médica"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="text"
        required
        onChange={(e) => handleData(e)}
        value={anograduacao}
        error={!!errors.find((error) => error.includes('Ano'))}
        helperText={errors.find((error) => error.includes('Ano'))}
      />

      <TextField
        variant="standard"
        label="CRM"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="number"
        required
        onChange={(e) => setCRM(e.target.value)}
        value={crm}
        error={!!errors.find((error) => error.includes('CRM'))}
        helperText={errors.find((error) => error.includes('CRM'))}
      />

      <TextField
        variant="standard"
        label="UF do CRM"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="text"
        required
        onChange={(e) => setUFCRM(e.target.value)}
        value={ufCRM}
        error={!!errors.find((error) => error.includes('UF'))}
        helperText={errors.find((error) => error.includes('UF'))}
      />

      <TextField
        variant="standard"
        label="Instituição da residência médica"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="text"
        required
        onChange={(e) => setInstituicaoResidencia(e.target.value)}
        value={instituicaoResidencia}
      />

      <TextField
        variant="standard"
        label="RQE"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }
        }}
        type="number"
        required
        onChange
