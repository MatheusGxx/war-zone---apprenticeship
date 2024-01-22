'use client'
import { useState } from 'react'
import { TextField, Snackbar, Alert } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const RegisterSixDoctor = (
  {
  setCPNJMedico,
  cnpjMedico,
  setRazaoSocialEmpresa,
  razaoSocialEmpresa,
  setNomeFantasia,
  nomeFantasia,
  setEnderecoMedico,
  enderecoMedico,
  setBairro,
  bairro,
  setCidade,
  cidade,
  setEstado,
  estado,
  setCEPMedico,
  cepMedico,
  setEmailContador,
  emailContador,
  setNumeroContador,
  numeroContador,
  setCurrentStep
  }
  ) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const Verification = () => {
      let camposVazios = [];
    
      if (cnpjMedico === '') {
        camposVazios.push('CPNJ');
      }
      if (razaoSocialEmpresa === '') {
        camposVazios.push('Razão Social');
      }
      if (nomeFantasia === '') {
        camposVazios.push('Nome Fantasia');
      }
      if (enderecoMedico === '') {
        camposVazios.push('Endereço');
      }
      if (bairro === '') {
        camposVazios.push('Bairro');
      }
      if (cidade === '') {
        camposVazios.push('Cidade')
      }
      if (estado === '') {
        camposVazios.push('Estado');
      }
      if (cepMedico === '') {
        camposVazios.push('CEP');
      }
      if (emailContador === '') {
        camposVazios.push('Email Contador')
      }
      if (numeroContador === '') {
        camposVazios.push('Numero Contador')
      }
    
    
      if (camposVazios.length > 0) {
        const camposFaltantes = camposVazios.join(', ')
        setSnackbarMessage(`Ops Doutor, você não preencheu o(s) campo(s): ${camposFaltantes}.`);
        handleSnackBarOpen();
      } else {
        handleNextClick();
      }
    }

    const handleNextClick = () => {
      setCurrentStep((prevStep) => (prevStep < 7 ? prevStep + 1 : prevStep))
    }
  
    const handleBackClick = () => {
      setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
    }

    const handleSnackbarClose = () => {
      setSnackbarOpen(false)
    };
  
    const handleSnackBarOpen = () =>{
      setSnackbarOpen(true)
    }
      
      
  return(
    <>
     
     <h1 className="text-blue-500 text-center"> Ficha de Cadastro </h1>

        <TextField
           variant="standard"
           label="CPNJ"
            InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
            }}
            type="text"
            required
            onChange={(e) => setCPNJMedico(e.target.value)}
            value={cnpjMedico}
          />

         <TextField
            variant="standard"
            label="Razão Social"
             InputProps={{
               sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
             }}
            type="text"
            required
            onChange={(e) => setRazaoSocialEmpresa(e.target.value)}
            value={razaoSocialEmpresa}/>

         <TextField
            variant="standard"
            label="Nome Fantasia"
            InputProps={{
               sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
            }}
            type="text"
            required
            onChange={(e) => setNomeFantasia(e.target.value)}
            value={nomeFantasia}/>

        <TextField
           variant="standard"
           label="Endereço"
           InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
           }}
           type="text"
           required
           onChange={(e) => setEnderecoMedico(e.target.value)}
           value={enderecoMedico}/>

         <TextField
           variant="standard"
           label="Bairro"
           InputProps={{
              sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
           }}
          type="text"
          required
          onChange={(e) => setBairro(e.target.value)}
          value={bairro}/>

        <TextField
          variant="standard"
          label="Cidade"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="text"
          required
          onChange={(e) => setCidade(e.target.value)}
          value={cidade}/>

        <TextField
          variant="standard"
          label="Estado"
          InputProps={{
             sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
           }}
          type="text"
          required
          onChange={(e) => setEstado(e.target.value)}
          value={estado}/>

        <TextField
          variant="standard"
          label="CEP"
          InputProps={{
             sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="number"
          required
          onChange={(e) => setCEPMedico(e.target.value)}
          value={cepMedico}/>

        <TextField
          variant="standard"
          label="Email Contador"
          InputProps={{
             sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="text"
          required
          onChange={(e) => setEmailContador(e.target.value)}
          value={emailContador}/>

         <TextField
           variant="standard"
           label="Numero Contador"
           InputProps={{
             sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
           }}
           type="text"
           required
           onChange={(e) => setNumeroContador(e.target.value)}
           value={numeroContador}/>

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
















































































