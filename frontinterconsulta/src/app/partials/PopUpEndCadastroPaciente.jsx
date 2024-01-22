'use client'
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, Snackbar , Alert } from "@mui/material";
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from "next/image";
import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { usePathname} from 'next/navigation'
import secureLocalStorage from 'react-secure-storage'
import { RegisterOnePatient } from "./RegisterOnePatient"
import { RegisterSecondPatient } from "./RegisterSecondPatient"
import { RegisterTreePatient } from "./RegisterTreePatient"
import { RegisterFourPatient } from "./RegisterFourPatient"
import { RegisterFivePatient } from "./RegisterFivePatient"
import { useEndRegister } from "../context/context"

export const EndRegisterPatient = () => {
  const [open, setOpen] = useState(false);
  const hiddenFileInput = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [foto, setFoto] = useState(null)

  const [genero, setGenero] = useState('')
  const [data, setData] = useState('')
  const [cpf, setCPF] = useState('')
  const [blood, setBlood] = useState('')
  const [estadoCivil, setEstadoCivil] = useState('')
  const [profissao, setProfissao] = useState('')
  const [CEP, setCEP] = useState('')
  const [cartaoSUS, setCartaoSUS] = useState('')
  const [nomeAcompanhante, setNomeAcompanhante] = useState('')
  const [telefoneAcompanhante, setTelefoneAcompanhante] = useState('')
  const [EmailAcompanhante, setEmailAcompanhante]  = useState('')
  const [Endereco, setEndereco] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [pais, setPais] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [croppedImage, setCroppedImage] = useState(null)
  const [croppedFile, setCroppedFile] = useState(null)
  const { setRegisterEndOk } = useEndRegister()

  const doenca = secureLocalStorage.getItem('Doenca')
  const id = secureLocalStorage.getItem('id')
  const NomePaciente = secureLocalStorage.getItem('NomePaciente')

  const Router = usePathname()
   
  const CreateRequestMutation  = useMutation( async (valueRequest) => {
    const response = await axios.post(`http://localhost:8080/api/obrigado/${id}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) => {
      const { FotoPaciente } = data
      secureLocalStorage.removeItem('FotoPaciente')
      secureLocalStorage.setItem('FotoPaciente', FotoPaciente)
      setOpen(false)
      secureLocalStorage.setItem('CadastroEndSucess', true)
      secureLocalStorage.setItem('RegisterSucessPatient', 'cadastroFinalizado')
      setRegisterEndOk(true)
    }
  })
  
  const HandleClickFinal = async () =>{
    const formData = new FormData()
    formData.append("Genero", genero)
    formData.append("Data", data)
    formData.append('TipoSanguineo', blood)
    formData.append('Profissao', profissao)
    formData.append('EstadoCivil', estadoCivil)
    formData.append("CPF", cpf)
    formData.append("CEP", CEP)

    formData.append('CartaoSUS', cartaoSUS)
    formData.append('NomeAcompanhante', nomeAcompanhante)
    formData.append('TelefoneAcompanhante', telefoneAcompanhante)
    formData.append('EmailAcompanhante', EmailAcompanhante)
    formData.append('EnderecoPaciente', Endereco)
    formData.append('CidadePaciente', cidade)
    formData.append('EstadoPaciente', estado)
    formData.append('Pais', pais)

    formData.append("route", Router)
    formData.append("file", foto)
    
    try{
      await CreateRequestMutation.mutateAsync(formData)
      setOpen(false)
    }catch(err){
      console.log(err)
      setSnackbarMessage(
        'Ops Algo deu errado :('
      );
      handleSnackBarOpen();
    }
  }

  const HandleClickEnd = () =>{
    if(genero === '' || data === '' || cpf === ''){
      setSnackbarMessage("Ops Paciente, Tem campo faltando para voce preencher.");
      handleSnackBarOpen()
    }else{
      HandleClickFinal()
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  };

  const handleSnackBarOpen = () =>{
    setSnackbarOpen(true)
  }

  useEffect(() => {
   setOpen(true) 
   },[])

  return (
    <>
        <Dialog open={open}
         PaperProps={{
          style: {
            maxWidth: '600px', 
            width: '100%',
          },
        }}>
        <div className="flex justify-center">
          <DialogTitle>
            <Image
            src={Logo2}
            alt="Logo 2 Interconsulta"
            height={200}
            width={220}
            />
          </DialogTitle>
          </div>
            <DialogContent>
              <div className="flex flex-col gap-5">

              <div className="">
                <h1 className="text-center font-bold text-blue-900"> 
                {NomePaciente} Finalize o seu Cadastro para ter acesso total aos especialistas que tratam {doenca}</h1>  
              </div>

             {currentStep === 1 &&
                <RegisterOnePatient
                genero={genero}
                setGenero={setGenero}
                setData={setData}
                data={data}
                setCPF={setCPF}
                cpf={cpf}
                blood={blood}
                setBlood={setBlood}
                setCurrentStep={setCurrentStep}
                NomePaciente={NomePaciente}
              />
             } 

             {currentStep === 2 &&
                <RegisterSecondPatient
                setCEP={setCEP}
                CEP={CEP}
                setEndereco={setEndereco}
                endereco={Endereco}
                setCidade={setCidade}
                cidade={cidade}
                setEstado={setEstado}
                estado={estado}
                setPais={setPais}
                pais={pais}
                setCurrentStep={setCurrentStep}
                />
             }

             {currentStep === 3 &&
               <RegisterTreePatient
               setNomeAcompanhante={setNomeAcompanhante}
               nomeAcompanhante={nomeAcompanhante}
               setTelefoneAcompanhante={setTelefoneAcompanhante}
               telefoneAcompanhante={telefoneAcompanhante}
               setEmailAcompanhante={setEmailAcompanhante}
               emailAcompanhante={EmailAcompanhante}
               setCurrentStep={setCurrentStep}
               NomePaciente={NomePaciente}
               />
             }

             {currentStep === 4 &&
             <RegisterFourPatient
             setCartaoSUS={setCartaoSUS}
             cartaoSUS={cartaoSUS}
             setEstadoCivil={setEstadoCivil}
             estadoCivil={estadoCivil}
             setProfissao={setProfissao}
             profissao={profissao}
             setCurrentStep={setCurrentStep}
             />
             }

             {currentStep === 5 &&
             <RegisterFivePatient
               hiddenFileInput={hiddenFileInput}
               setFoto={setFoto}
               Foto={foto}
               HandleClickEnd={() => HandleClickEnd()}
               CreateRequestMutation={CreateRequestMutation}
               setCroppedImage={setCroppedImage}
               croppedImage={croppedImage}
               setCroppedFile={setCroppedFile}
               croppedFile={croppedFile}
               doenca={doenca}
             />
             }
            </div>
            </DialogContent>

          <div className="flex justify-end p-4">
            <Image
            src={Logo}
            alt="Logo Interconsulta"
            height={40}
            width={40}
            className="animate-spin-slow"
            />
          </div>
        </Dialog>

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
