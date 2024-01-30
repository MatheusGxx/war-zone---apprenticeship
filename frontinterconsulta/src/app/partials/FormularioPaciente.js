'use client'
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, TextField , Snackbar , Alert, Autocomplete } from "@mui/material";
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from "next/image";
import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { useSearchParams, useRouter, usePathname} from 'next/navigation'
import secureLocalStorage from 'react-secure-storage'
import { ComponenteAudio } from "./ComponentAudio";
import { config } from '../config.js'

const FormularioPaciente = () => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const [doenca, setDoenca] = useState('')
  const [sintomasandDoencas, setSintomasAndDoencas] = useState(null)

  const [fraseDoença, setFraseDoença] = useState(null)
  const [resumoIA, setResumoIA] = useState(false)

  const Params = useSearchParams()

  const id = Params.get('id')
  const NomePaciente = Params.get('name')

  const Router = usePathname()

  const NavegationPage = useRouter()

  const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/
   
  const CreateRequestMutation  = useMutation( async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/obrigado/${id}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) =>{
      const { token, NomePaciente, PacienteDoenca } = data 
      secureLocalStorage.setItem('token', token)
      secureLocalStorage.setItem('id', id)
      secureLocalStorage.setItem('NomePaciente', NomePaciente)
      secureLocalStorage.setItem('Doenca', PacienteDoenca)
    }
  })
  
  const getSintomasAndDoencas = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/get-sintomas-doencas`, valueRequest)
      setSintomasAndDoencas(response.data.arr)
      return response.data
    }
  )

  const ResumoDoença = useMutation(async (valueRequest) => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/get-doenca?doenca=${valueRequest}`);
      setFraseDoença(response.data)
    } catch (error) {
      console.error('Erro na solicitação:', error)
    }
  })

  useEffect(() => {
    getSintomasAndDoencas.mutateAsync()
  }, [])
  
  useEffect(() => {
    if(doenca){
      ResumoDoença.mutateAsync(doenca)
    }
  },[doenca])

  useEffect(() => {

  },[resumoIA, fraseDoença])

  const HandleClickFinal = async () =>{
    const formData = new FormData()
    formData.append("Doenca", doenca)
    formData.append("route", Router)
    
    try{
      await CreateRequestMutation.mutateAsync(formData)
      NavegationPage.push(`/especialistas-disponiveis`)
    }catch(err){
      setSnackbarMessage(
        'Ops Algo deu errado :('
      );
      handleSnackBarOpen();
    }
  }

  const HandleClickEnd = () =>{
    if(doenca === ''){
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

  const handleOpenClick = () => {
    setOpen(true);
  }

  return (
    <>
      <button onClick={() => handleOpenClick()} className="w-72 h-12 rounded-full bg-indigo-950 text-white font-light">
           Finalizar Cadastro
      </button>
     
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
                <div className="mb-3">
                <h1 className="text-center font-bold"> Informaçoes da Doença </h1>
              </div>

              {!doenca &&
                <Autocomplete
                value={doenca === '' ? null : doenca}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setDoenca(newValue);
                  }
                }}
                options={sintomasandDoencas}
                noOptionsText="Sem resultados"
                renderInput={(params) => <TextField {...params} label="Doença" variant="standard" />}
                className="w-full border-b border-blue-500 sm:w-full"
             />
              }
             {doenca ? 
                <>
                  <ComponenteAudio
                  doenca={doenca}
                  NomePaciente={NomePaciente}
                  setResumoIA={(value) => setResumoIA(value)}
                  resumoIA={resumoIA}
                  fraseDoença={fraseDoença}
                  CreateRequestMutation={CreateRequestMutation}
                  HandleClickEnd={() => HandleClickEnd()}
                  />
                </>
                :
             null
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

export default FormularioPaciente 