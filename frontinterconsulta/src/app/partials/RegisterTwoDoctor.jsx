'use client'
import { useState } from 'react'
import { TextField, Autocomplete, Snackbar , Alert } from "@mui/material"
import { EspecialidadesAtendidas } from "./EspecialidadesAtendidas"
import { EspecialidadesUnidades } from './EspecialidadesUnidade'
import { AreadeAtuacaoAtendidas } from './AreadeAtuaçaoAtendidas'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'


export const RegisterTwoDoctor = (
  {
    setResumo,
    resumo,
    setCurrentStep,
  }
  ) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const Verification = () => {
      let camposVazios = []
    
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
      <h1 className="text-blue-500 text-center text-lg font-semibold"> 
       Resumo Profissional
      </h1>

      <TextField
        label="Conte um pouco sobre sua carreira médica e trajetória profissional"
        multiline
        rows={6} 
        variant="standard" 
        InputProps={{
          sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
        }}
        onChange={(e) => setResumo(e.target.value)}
        value={resumo}
        required
      />

     <div className="w-full flex justify-between items-center">
        <div className='flex gap-3 cursor-pointer' onClick={handleBackClick}>
        <ArrowBackIosIcon color="primary"/>
        <h1 className='font-bold text-blue-500'> Voltar </h1>
        </div>
      <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>

        <div className='flex gap-3 cursor-pointer' onClick={Verification}>
        <h1 className='font-bold text-blue-500'> Avançar </h1>
        <ArrowForwardIosIcon color="primary"/> 
        </div>  
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
