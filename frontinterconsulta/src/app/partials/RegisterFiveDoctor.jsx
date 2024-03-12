'use client'
import { useState } from 'react'
import { TextField, Snackbar, Alert } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'


export const RegisterFiveDoctor = (
  {
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
  }
  ) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const Verification = () => {
      let camposVazios = [];
    
      if (precoConsulta === '') {
        camposVazios.push('Preço da Consulta por Telemedicina');
      }
      if (nometitular === '') {
        camposVazios.push('Nome do Titular da Conta?');
      }
      if (numeroconta === '') {
        camposVazios.push('Numero da sua conta');
      }
      if(numeroAgencia === ''){
         camposVazios.push('Numero da sua Agencia')
      }
      if(banco === ''){
        camposVazios.push('Seu Banco')
      }
      if(pix === ''){
        camposVazios.push('Sua Chave Pix')
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
      setCurrentStep((prevStep) => (prevStep < 6 ? prevStep + 1 : prevStep))
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
      <h1 className="text-blue-500 text-center"> Preferencias de Pagamento </h1>

      <TextField
          variant="standard"
          label="Preço da Consulta por Telemedicina"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="number"
          required
          onChange={(e) => setPrecoConsulta(e.target.value)}
          value={precoConsulta}/>

      <TextField
          variant="standard"
          label="Nome do Titular da conta"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="text"
          required
          onChange={(e) => setNomeTitular(e.target.value)}
          value={nometitular}/>

      <TextField
          variant="standard"
          label="Numero da sua conta"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="number"
          required
          onChange={(e) => setNumeroConta(e.target.value)}
          value={numeroconta}/>

          <TextField
          variant="standard"
          label="Numero da sua agencia"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="number"
          required
          onChange={(e) => setNumeroAgencia(e.target.value)}
          value={numeroAgencia}/>

          <TextField
          variant="standard"
          label="Seu Banco"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="text"
          required
          onChange={(e) => setBanco(e.target.value)}
          value={banco}/>

          <TextField
          variant="standard"
          label="Sua chave Pix"
          InputProps={{
            sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
          }}
          type="number"
          required
          onChange={(e) => setPix(e.target.value)}
          value={pix}/>

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