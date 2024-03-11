'use client'
import { useState } from 'react'
import { TextField, Autocomplete, Snackbar , Alert } from "@mui/material"
import { TitutloEspecialista } from "./TituloEspecialista"
import { TypesDoctors } from '../components/TypesDoctors'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'
import { useEffect } from 'react'

export const RegisterOneDoctor = (
  {
    titulo,
    setTitulo,
    setNome,
    nome,
    setDataNascimento,
    dataNascimento,
    setTypeMedico,
    typeMedico,
    setCurrentStep,
    setTypeDoctorPublic
  }
  ) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    useEffect(() => {
       if(typeMedico === 'Atendimento Público'){
        setTypeDoctorPublic(true)
       }
       if(typeMedico === 'Atendimento Particular'){
        setTypeDoctorPublic(false)
       }
    },[typeMedico])
      
    const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/

    const handleData = (e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      const formattedValue = value.replace(regex, '$1/$2/$3')
      setDataNascimento(formattedValue);
    }

    const Verification = () => {
      let camposVazios = [];
    
      if (titulo === '') {
        camposVazios.push('Título Especialista');
      }
      if (nome === '') {
        camposVazios.push('Como você é Conhecido(a)?');
      }
      if (dataNascimento === '') {
        camposVazios.push('Data de Nascimento');
      }
      if(typeMedico === ''){
        camposVazios.push('typeMedico')
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
    <h1 className="text-blue-500 text-center"> Informaçoes Pessoais do Médico </h1>

    <Autocomplete
      value={titulo === '' ? null : titulo}
      onChange={(event, newValue) => {
        if (newValue !== null) {
          setTitulo(newValue);
        }
      }}
      options={TitutloEspecialista}
      noOptionsText="Sem resultados"
      renderInput={(params) => <TextField {...params} label="Titulo Especialista" variant="standard" />}
      className="w-full border-b border-blue-500 sm:w-full"
    />

      <TextField
      variant="standard"
      label="Como voce é Conhecido(a) ?"
      InputProps={{
        sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
      }}
      type="text"
      required
      onChange={(e) => setNome(e.target.value)}
      value={nome}/>

      <TextField
      variant="standard"
      label="Data de Nascimento"
      InputProps={{
        sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
      }}
      type="text"
      required
      onChange={(e) => handleData(e)}
      value={dataNascimento}/>

     <Autocomplete
      value={typeMedico === '' ? null : typeMedico}
      onChange={(event, newValue) => {
        if (newValue !== null) {
          setTypeMedico(newValue);
        }
      }}
      options={TypesDoctors}
      noOptionsText="Sem resultados"
      renderInput={(params) => <TextField {...params} label="Tipo de Atendimento" variant="standard" />}
      className="w-full border-b border-blue-500 sm:w-full"
    />

      <div className="w-full flex justify-between items-center">
      <ArrowBackIosIcon color="primary" className="cursor-pointer" onClick={handleBackClick}/>
      <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
      <ArrowForwardIosIcon color="primary" className="cursor-pointer" onClick={Verification}/>    
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
   </>
  )
}