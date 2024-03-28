'use client'
import { useState, useEffect } from "react"
import { NotLogged } from "../partials/NotLoggedPopUp"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from 'axios'
import Image from 'next/image'
import Logo from '../public/logo.png'
import LogoCinza from '../public/LogoCinza.png'
import iconNull from '../public/IconNull.png'
import { CasosClinico } from "../partials/popUpCasoClinico"
import { useRouter } from "next/navigation"

import { useHorariosDoctor } from "../context/context"
import PopUpMedicoHoras from "../partials/PopUpHorasMedico"

import secureLocalStorage from 'react-secure-storage'
import { Api2, config } from '../config.js'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Snackbar , Alert } from '@mui/material'
import { LimitedNotificationPopUp } from "./LimitedNotifications"

const ContentMédico = () => {

  const [notLogged, setNotLogged] = useState(false)
  const [selectedCasosClinicos, setSelectedCasosClinicos] = useState([])
  const [nomePaciente, setNomePaciente] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [statusSnackBar, setStatusSnackBar] = useState('')
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'left'
  })

  const { vertical, horizontal } = position

  const [err, setErr] = useState('')
  const [keyPaciente, setKeyPaciente] = useState('') 
  const [limitedNotification, setLimitedNotification] = useState(false)
  const [messageLimitedNotification, setMessageLimitedNotification] = useState(null)

  const {  setHorariosDoctor, horariosDoctor } = useHorariosDoctor()
  const Navigation = useRouter()

  const queryClient = useQueryClient()

  const id = secureLocalStorage.getItem('id')
  
  const Especialidade = secureLocalStorage.getItem('Especialidade')
  const NomeEspecialista = secureLocalStorage.getItem('NomeMedico')
  const NomePaciente = secureLocalStorage.getItem('NomePaciente')
  const NomeUnidade = secureLocalStorage.getItem('NomeUnidade')
  const InitialContactDoctor = secureLocalStorage.getItem('InitialContact')


  useEffect(() => {
    if(InitialContactDoctor){
      setHorariosDoctor(true)
     }
  },[InitialContactDoctor, nomePaciente])

  const Token = secureLocalStorage.getItem('token') 

  useEffect(() => {

    if(Token === null){
      setNotLogged(true)
    }
  }, [notLogged])

  const NotificationPatient = useMutation(async (data) => {
    try{
     const request = await axios.post(`${Api2.apiBaseUrl}/api2/doctor-notification-patient`, data)
     return request.data
    }catch(err){
      console.log(err)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('Pacientes')
    },
    onSuccess:(data) => {
      if (data && data.NotificationOk) {
        setStatusSnackBar('success')
        setSnackbarMessage(`${NomeEspecialista} o(a) Paciente: ${nomePaciente} foi Notificado com Sucesso!`)
        handleSnackBarOpen()
      }
      if(data && data.doesNotSuportNotification){
        setLimitedNotification(true)
        setMessageLimitedNotification(data.doesNotSuportNotification)
      }
    },
    onError: (error) => {
      setErr(error.response.data.error)
    }
  })

  const RequestGetPatients = async () => {
    try{
      const request = await axios.get(`${config.apiBaseUrl}/api/get-patients/${id}`)
      setSelectedCasosClinicos(request.data.cleanPatients.length)
      return request.data.cleanPatients
    }catch(e){
      throw new Error('Error Fetching Data')
    }
  }

  const queryKey = ['Pacientes', keyPaciente]
  const { data, isFetching, isError, isSuccess } = useQuery(
    queryKey, 
    () => RequestGetPatients(keyPaciente),
  )

  const HandleNotificationPatient = (nomePaciente, idP, DoctorsSolicitations) => {
    try{
      setNomePaciente(nomePaciente)
      if(DoctorsSolicitations.includes(id)){
        setStatusSnackBar('error')
        setSnackbarMessage(`${NomeEspecialista}, O Paciente, ${nomePaciente}, ja foi Notificado!`)
        handleSnackBarOpen()
      }else{
        NotificationPatient.mutateAsync({ idD: id, idP: idP })
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  const HandleNavigationNotLoggued = (route) => {
    Navigation.push(route)
  }

  return (
    <>

    {notLogged === false && NomeEspecialista && !NomePaciente && !NomeUnidade ? 
     <>
        <div className='flex justify-center mt-10 gap-5 mb-3'>
        <h1 className="font-bold text-blue-950 text-2xl text-center sm:text-xl"> Casos Clinicos para {Especialidade}</h1>
      </div>

      <h1 className="font-bold text-blue-600 text-2xl text-center sm:text-xl"> 
      {selectedCasosClinicos >= 1
       ?
       <>
       Quantidade de Casos Clinicos: {selectedCasosClinicos}

       </>
       : 
       <>
       No momento nao temos casos clinicos para {Especialidade}
       </>
       }
      </h1>
     
        <div className="flex justify-center items-center flex-wrap gap-5">
          {isFetching ? (
            <div className="flex justify-center items-center text-xl gap-3 sm:flex sm:flex-wrap sm:text-base md:flex md:flex-col">
              <Image src={Logo} alt="Médico não está disponível no momento" width={100} height={100} className="animate-pulse"/>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center flex-col gap-5 pt-24">
              <h1 className="text-center text-xl sm:whitespace-pre-wrap"> 
                 {err}
              </h1>
            </div>
          )  : 
             isSuccess ? (
            <div className="flex gap-7 flex-wrap mb-7 justify-center items-center sm:gap-10 w-full">
              {data?.map((data, index) => (
                <>
            <div key={index} 
             className={`cursor-pointer flex flex-col border-4 rounded-xl p-5 sm:w-10/12 w-1/3 h-1/2 gap-1
             ${data.Consultas >= 1 ? 'bg-gray-100' : ''}`}
            >
              <div className=" flex justify-center items-center sm:flex sm:justify-center mb-2 sm:mb-0">
                <Image
                  src={data.Consultas >= 1 ? LogoCinza : Logo}
                  alt="Foto do Caso Clinico"
                  width={100}
                  height={100}
                  className="sm:rounded-full rounded-xl"
                />
                  </div>

                   <p className="text-indigo-950 font-bold text-center">Nome: {data.nome}</p>
                   <p className="text-indigo-950 font-bold whitespace-pre-wrap text-center"> Queixa: {data.doenca}</p>
                   {data.Consultas >= 1 ? 
                   null
                   : 
                   <div className="flex gap-4 justify-center items-center" 
                   onClick={() => HandleNotificationPatient(data.nome, data.id, data.DoctorsSolicitations)}
                   aria-disabled={NotificationPatient.isLoading}
                   >
                    <WhatsAppIcon color="success"/>
                    {data.DoctorsSolicitations.includes(id) ? 
                      <h1 className="text-green-500"> Paciente Notificado </h1>
                      : 
                      <h1 className=""> Notificar Paciente</h1>
                    }
                   </div>
                   }
                   <p className={`font-bold ${data.Consultas >= 1 ? 'text-red-600' : 'text-blue-600'} text-center`}>
                      Status: {data.Consultas >= 1 ? 'Caso Finalizado' : 'Paciente Aguardando'}
                   </p>
                  
                </div>
                </>
              ))}
            </div>
          ) :  null}

        </div>
     </>
     : 
     NomePaciente ? 
     <>
     <div className="flex justify-center items-center flex-col gap-5 pt-24">
       <h1 className="text-center text-blue-600 text-xl sm:whitespace-pre-wrap"> 
        Paciente {NomePaciente} apenas Médicos tem acesso a essa area do Interconsulta!
       </h1>
      <button
         className="p-2 bg-red-600 w-1/3 rounded-full text-white font-bold sm:w-1/2"
         onClick={() => HandleNavigationNotLoggued('/welcome/login-paciente')}> 
         Logar como Paciente
      </button>
      </div>
     </>
      :
     NomeUnidade ? 
     <>
     <div className="flex justify-center items-center flex-col gap-5 pt-24">
       <h1 className="text-center text-blue-600 text-xl sm:whitespace-pre-wrap"> 
        Unidade {NomeUnidade} apenas Médicos tem acesso a essa area do Interconsulta!
       </h1>
      <button
         className="p-2 bg-red-600 w-1/3 rounded-full text-white font-bold sm:w-1/2"
         onClick={() => HandleNavigationNotLoggued('/welcome/login-unidade')}> 
         Logar como Unidade de Saude
     </button>
      </div>
     </>
      :
     <>
     <div className="flex justify-center items-center flex-col gap-5 pt-24">
       <h1 className="text-center text-blue-600 text-xl sm:whitespace-pre-wrap"> Doutor voce nao esta Logado para acessar todos os Nossos casos clinicos
          Logue Agora!
       </h1>
      <button
         className="p-2 bg-red-600 w-1/3 rounded-full text-white font-bold sm:w-1/2"
         onClick={() => HandleNavigationNotLoggued('/welcome/login-medico')}> 
         Faça Login Agora 
    </button>
      </div>
      <NotLogged 
      messageOne="Atenção Dr(a)!!!" 
      messageTwo="Você não está logado. Por favor, faça login para poder ver todos os nossos casos clínicos" />
     </>
    }
   
        <div className="flex justify-end mt-5 mr-3 mb-5">
          <Image src={Logo} width={40} height={40} alt="Logo Interconsulta" className="animate-spin-slow"/>
        </div>

        
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose} severity={statusSnackBar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

        {limitedNotification &&
        <LimitedNotificationPopUp
        message={messageLimitedNotification}
        onClose={() => setLimitedNotification(false)}
        />
        }

        {horariosDoctor && <PopUpMedicoHoras/>}

    </>
  );
};

export default ContentMédico;
