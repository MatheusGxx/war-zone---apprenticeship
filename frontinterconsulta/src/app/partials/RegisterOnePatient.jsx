'use client'
import { useState } from "react";
import { Generos } from "./Generos";
import { TiposSanguinios } from "./TiposSanguineos";
import { Autocomplete, TextField, Snackbar, Alert } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Logo from '../public/logo.png'
import Image from 'next/image'

export const RegisterOnePatient = ({
  genero,
  setGenero,
  setData,
  data,
  setCPF,
  cpf,
  blood,
  setBlood,
  setCurrentStep,
  NomePaciente
}) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/

    const Verification = () => {
      let camposVazios = [];
    
      if (cpf === '') {
        camposVazios.push('Escreva o seu CPF');
      }

      if(data === ''){
        camposVazios.push('Digite a sua Data de Nascimento')
      }

      if(genero === ''){
        camposVazios.push('Seu Genero')
      }

      if (camposVazios.length > 0) {
        const camposFaltantes = camposVazios.join(', ');
        setSnackbarMessage(`Ops ${NomePaciente}, você não preencheu o(s) campo(s): ${camposFaltantes}.`);
        handleSnackBarOpen();
      } else {
        handleNextClick();
      }
    }
    
    const handleNextClick = () => {
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
    }


    const handleBackClick = () => {
        setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
    }

    const handleData = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const formattedValue = value.replace(regex, '$1/$2/$3')
        setData(formattedValue);
    }

    const handleDataCPF = (e) => {
      let value = e.target.value.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
      const regex = /^\d+$/; // Nova regex para permitir apenas dígitos
    
      // Permite que o campo seja completamente apagado
      if (value === '' || regex.test(value)) {
        setCPF(value);
      }
    };
    
    const handleSnackbarClose = () => {
      setSnackbarOpen(false)
    };
  
    const handleSnackBarOpen = () =>{
      setSnackbarOpen(true)
    }
  
    
  return (
    <>

    <h1 className="font-bold text-blue-500 text-center text-2xl"> Dados Pessoais </h1>

    <TextField
        variant="standard"
        label="Escreva o seu CPF"
        InputProps={{
          sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => handleDataCPF(e)}
        value={cpf}
        type="text"
        required
      />

    <TextField
        variant="standard"
        label="Digite a sua data de nascimento"
        InputProps={{
          sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => handleData(e)}
        value={data}
        type="text"
        required
      />

      <Autocomplete
        value={genero === '' ? null : genero}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            setGenero(newValue);
          }
        }}
        options={Generos}
        noOptionsText="Sem resultados"
        renderInput={(params) => <TextField {...params} label="Seu Genero" variant="standard" />}
        className="w-full border-b border-blue-500 sm:w-full"
      />

     <Autocomplete
        value={blood === '' ? null : blood}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            setBlood(newValue);
          }
        }}
        options={TiposSanguinios}
        noOptionsText="Sem resultados"
        renderInput={(params) => <TextField {...params} label="Tipo Sanguinio" variant="standard" />}
        className="w-full border-b border-blue-500 sm:w-full"
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
  );
};
