import { useState } from 'react'
import {
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
  Button,
  Typography,
} from '@mui/material'
import { EspecialidadesAtendidas, EspecialidadesUnidades, AreadeAtuacaoAtendidas } from './data'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const RegisterTwoDoctor = ({
  especialidade,
  setEspecialidade,
  atuacao,
  setAtuacao,
  resumo,
  setResumo,
  setCurrentStep,
  typeDoctorPublic,
}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleNextClick = () => {
    if (
      !especialidade ||
      especialidade === 'Selecione' ||
      !atuacao ||
      atuacao === 'Selecione' ||
      !resumo ||
      resumo.trim().length === 0
    ) {
      setErrorMessage('Por favor, preencha todos os campos.')
      setSnackbarOpen(true)
      return
    }

    setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep))
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  return (
    <>
      <Typography variant="h5" component="h1" textAlign="center" mb={3}>
        Especialidade Médica Principal
      </Typography>

      <Autocomplete
        value={especialidade || null}
        onChange={(event, newValue) => {
          setEspecialidade(newValue)
        }}
        options={typeDoctorPublic ? EspecialidadesUnidades : EspecialidadesAtendidas}
        noOptionsText="Sem resultados"
        renderInput={(params) => (
          <TextField {...params} label="Especialidade Médica" variant="standard" />
        )}
        className="w-full border-b border-blue-500 sm:w-full"
      />

      <Autocomplete
        value={atuacao || null}
        onChange={(event, newValue) => {
          setAtuacao(newValue)
        }}
        options={AreadeAtuacaoAtendidas}
        noOptionsText="Sem resultados"
        renderInput={(params) => (
          <TextField {...params} label="Área de Atuação Médica Principal" variant="standard" />
        )}
        className="w-full border-b border-blue-500 sm:w-full"
      />

      <TextField
        label="Conte um pouco sobre sua carreira médica e trajetória profissional"
        multiline
        rows={4}
        variant="standard"
        InputProps={{
          sx: { borderBottom: '1px solid blue' }, // Define a cor da linha inferior
        }}
        onChange={(e) => setResumo(e.target.value)}
        value={resumo}
        required
      />

      <div className="w-full flex justify-between items-center mt-4">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIosIcon />}
          onClick={handleBackClick}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNextClick}
        >
          Próximo
        </Button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
