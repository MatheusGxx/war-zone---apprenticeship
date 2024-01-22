'use client'
import { useState } from 'react'
import { TextField, Autocomplete, Snackbar , Alert } from "@mui/material"
import { EspecialidadesAtendidas } from "./EspecialidadesAtendidas"
import { AreadeAtuacaoAtendidas } from './AreadeAtuaçaoAtendidas'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'


export const RegisterTwoDoctor = (
  {
    especialidade,
    setEspecialidade,
    atuacao,
    setAtuacao,
    setResumo,
    resumo,
    setCurrentStep
  }
  ) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const Verification = () => {
      let camposVazios = [];
    
      if (especialidade === '') {
        camposVazios.push('Especialidade Médica');
      }
      if (atuacao === 'Área de Atuação Médica Principal') {
        camposVazios.push('');
      }
      if (resumo === '') {
        camposVazios.push('Conte um pouco sobre sua carreira médica e trajetória profissional');
      }
    
      if (camposVazios.length > 0) {
        const camposFaltantes = camposVazios.join(', ');
        setSnackbarMessage(`Ops Doutor, você não preencheu o(s) campo(s): ${camposFaltantes}.`);
        handleSnackBarOpen();
      } else {

        handleNextClick();
      }
    }
    
    const handleNextClick = () => {
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
    };
  
    const handleBackClick = () => {
      setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
    }

    const handleSnackbarClose = () => {
      setSnackbarOpen(false)
    };
  
    const handleSnackBarOpen = () =>{
      setSnackbarOpen(true)
    }
  return(
    <>
      <h1 className="text-blue-500 text-center"> 
      Especialidade Médica Principal
      </h1>

      <Autocomplete
        value={especialidade === '' ? null : especialidade}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            setEspecialidade(newValue);
          }
        }}
        options={EspecialidadesAtendidas}
        noOptionsText="Sem resultados"
        renderInput={(params) => <TextField {...params} label="Especialidade Médica" variant="standard" />}
        className="w-full border-b border-blue-500 sm:w-full"
      />

      <Autocomplete
        value={atuacao === '' ? null : atuacao}
        onChange={(event, newValue) => {
          if (newValue !== null) {
                setAtuacao(newValue);
            }
          }}
        options={AreadeAtuacaoAtendidas}
        noOptionsText="Sem resultados"
        renderInput={(params) => <TextField {...params} label="Área de Atuação Médica Principal" variant="standard" />}
        className="w-full border-b border-blue-500 sm:w-full"
      />

      <TextField
        label="Conte um pouco sobre sua carreira médica e trajetória profissional"
        multiline
        rows={4} 
        variant="standard" 
        InputProps={{
          sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
        }}
        onChange={(e) => setResumo(e.target.value)}
        value={resumo}
        required
      />

      <div className="w-full flex justify-between items-center">
      <ArrowBackIosIcon color="primary" className="cursor-pointer" onClick={handleBackClick}/>
      <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
      <ArrowForwardIosIcon color="primary" className="cursor-pointer" onClick={Verification}/>    
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
   </>
  )
}
