'use client'
import { useState } from 'react'
import { TextField, Autocomplete, Snackbar, Alert } from "@mui/material"
import { CertificaçoesEndocanabinoide } from './CertificacaoEndocanabinoide.js'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'


export const RegisterFourDoctor = (
  {
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
    posGraducao,
    certificacao,
    setCertificacao,
    setCurrentStep
  }
  ) => {
    
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const Verification = () => {
      let camposVazios = [];
    
      if (formacao === '') {
        camposVazios.push('Instituiçao da Graduaçao Médica');
      }
      if (anograduacao === '') {
        camposVazios.push('Ano da Graduaçao Médica');
      }
      if (crm === '') {
        camposVazios.push('CRM');
      } 
      if(ufCRM === ''){
        camposVazios.push('UF do CRM')
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
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep))
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
     <h1 className="text-blue-500 text-center">Formaçao Médica</h1>
                  <TextField
                   variant="standard"
                   label="Instituiçao da Graduaçao Médica"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                  }}
                   type="text"
                   required
                   onChange={(e) => setFormacao(e.target.value)}
                   value={formacao}/>

                <TextField
                   variant="standard"
                   label="Ano da Graduaçao Médica"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                  }}
                   type="number"
                   required
                   onChange={(e) => setAnoGraduacao(e.target.value)}
                   value={anograduacao}/>

                <TextField
                   variant="standard"
                   label="CRM"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
                  }}
                  type="number"
                  required
                  onChange={(e) => setCRM(e.target.value)}
                  value={crm}/>

               <TextField
                   variant="standard"
                   label="UF do CRM"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
                  }}
                  type="text"
                  required
                  onChange={(e) => setUFCRM(e.target.value)}
                  value={ufCRM}/>

              <TextField
                   variant="standard"
                   label="Instituicao da Residencia Médica"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
                  }}
                  type="text"
                  required
                  onChange={(e) => setInstituicaoResidencia(e.target.value)}
                  value={instituicaoResidencia}/>

              <TextField
                   variant="standard"
                   label="RQE"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
                  }}
                  type="number"
                  required
                  onChange={(e) => setRQE(e.target.value)}
                  value={rqe}/>

                <TextField
                   variant="standard"
                   label="Pós Graduaçao Médica Principal"
                   InputProps={{
                    sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
                  }}
                   type="text"
                   required
                   onChange={(e) => setPosGraduacao(e.target.value)}
                   value={posGraducao}/>

                <Autocomplete
                    value={certificacao === '' ? null : certificacao}
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                            setCertificacao(newValue);
                        }
                      }}
                    options={CertificaçoesEndocanabinoide}
                    noOptionsText="Sem resultados"
                    renderInput={(params) => <TextField {...params} label="Certificacao em Medicina endocanabinoide" variant="standard" />}
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
  )
}