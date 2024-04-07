'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Logo from '../public/logo.png'
import SecondLogo from '../public/Logo2.png'
import { config } from '../config.js'

import { TextField, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import IconBack from '../partials/IconBack.js'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const Login = ({ title, ImagemLateral, MessageButton, secondRoute, treeRoute, plataform, apelido }) => {

  const[email, setEmail] = useState('')
  const[senha, setSenha] = useState('')
  const[snackbarOpen, setSnackbarOpen] = useState(false);
  const[snackbarMessage, setSnackbarMessage] = useState('');

  const Router = useRouter()
  const route = usePathname()
  const params = useSearchParams()

  const RotaMédico = '/welcome/login-medico'
  const RotaPaciente = '/welcome/login-paciente'
  const RotaUnidade = '/welcome/login-unidade'
  
  const ValidatorDoctor = useMutation(async (valueRequest) => {
    try{
      const response = await axios.post(`${config.apiBaseUrl}/api/verify-doctor`, valueRequest)
      return response.data
    }catch(err){
      console.log(err)
    }
  },{
    onSuccess: (data) => {
      const { valid } = data

      if(valid === false){
        secureLocalStorage.setItem('StatusRegister', false)
        Router.push(`${plataform}`)
      }else{
        secureLocalStorage.setItem('StatusRegister', true)
        Router.push(`${plataform}`)
      }
    }
  })
 
  const ValidatorPaciente = useMutation(async (valueRequest) => {
    try{
      const response = await axios.post(`${config.apiBaseUrl}/api/verify-data-patient`, valueRequest)
      return response.data
    }catch(err){
      console.log(err)
    }
  },{
    onSuccess: (data) => {
      const { valid } = data
 
      if(valid === false){
        secureLocalStorage.setItem('StatusRegister', false)
        Router.push(`${plataform}`)
      }else{
        secureLocalStorage.setItem('StatusRegister', true)
        Router.push(`${plataform}`)
      }
    }
  })

  const CreateRequestMutation = useMutation(async (valueRequest) =>{
    const response = await axios.post(`${config.apiBaseUrl}/api/login`, valueRequest)
    return response.data
  },{
    onSuccess: async (data) => { 

      const { 
         token,
         NomeMedico, 
         Especialidade,
         CRMM,
         ModelidUserLogged,
         FotoMedico,
         TypeDoctor,
         NomePaciente,
         DoencaPaciente,
         FotoPaciente,
         NomeUnidade,
         FotoUnidade,
        } = data
      
     switch(route){

      case '/welcome/login-medico':
       
      const tokenStorage = secureLocalStorage.getItem('token')
      const ModelidUser = secureLocalStorage.getItem('id')
      const NomeMedicoStorage = secureLocalStorage.getItem('NomeMedico')
      const EspecialidadeStorage = secureLocalStorage.getItem('Especialidade')
      const CRMStorage = secureLocalStorage.getItem('CRMMedico')
      const FotoStorageMedico = secureLocalStorage.getItem('FotoMedico')
      const TypeDoctorStorage = secureLocalStorage.getItem('TypeDoctor')


      if(tokenStorage && ModelidUser &&  NomeMedicoStorage && EspecialidadeStorage && CRMStorage && FotoStorageMedico && TypeDoctorStorage){
        console.log('Medico ja esta autenticado no interconsulta =/')
      }else{
        let utms = secureLocalStorage.getItem('utms')
        secureLocalStorage.clear()
        secureLocalStorage.setItem('token', token)
        secureLocalStorage.setItem(`id`, ModelidUserLogged)
        secureLocalStorage.setItem('NomeMedico', NomeMedico)
        secureLocalStorage.setItem('Especialidade', Especialidade)
        secureLocalStorage.setItem('CRMMedico', CRMM)
        secureLocalStorage.setItem('FotoMedico', FotoMedico)
        secureLocalStorage.setItem('TypeDoctor', TypeDoctor)
        secureLocalStorage.setItem('utms', utms)
      }

      await ValidatorDoctor.mutateAsync({ email: email })

      break

      case '/welcome/login-paciente':

      const tokenStoragePaciente = secureLocalStorage.getItem('token')
      const ModelidUserPaciente = secureLocalStorage.getItem('id')
      const NomeStoragePaciente = secureLocalStorage.getItem('NomePaciente')
      const Doenca = secureLocalStorage.getItem('Doenca')
      const FotoStoragePaciente = secureLocalStorage.getItem('FotoPaciente')

      if(tokenStoragePaciente && ModelidUserPaciente &&  NomeStoragePaciente && Doenca && FotoStoragePaciente){
        console.log('Usuario ja esta autenticado no interconsulta =/')
      }else{
        let utms = secureLocalStorage.getItem('utms')
        secureLocalStorage.clear()
        secureLocalStorage.setItem('token', token)
        secureLocalStorage.setItem(`id`, ModelidUserLogged)
        secureLocalStorage.setItem('NomePaciente', NomePaciente)
        secureLocalStorage.setItem('Doenca', DoencaPaciente)
        secureLocalStorage.setItem('FotoPaciente', FotoPaciente)
        secureLocalStorage.setItem('utms', utms)
      }

      await ValidatorPaciente.mutateAsync({ email: email })

      break

      case '/welcome/login-unidade':

      const tokenStorageUnidade = secureLocalStorage.getItem('token')
      const ModelidUserUnidade = secureLocalStorage.getItem('id')
      const NomeStorageUnidade = secureLocalStorage.getItem('NomeUnidade')
      const FotoStorageUnidade = secureLocalStorage.getItem('FotoUnidade')
   

      if(tokenStorageUnidade && ModelidUserUnidade && NomeStorageUnidade && FotoStorageUnidade){
        console.log('Usuario ja esta autenticado no interconsulta =/')
        Router.push(`${plataform}`)
      }else{
        secureLocalStorage.clear()
        secureLocalStorage.setItem('token', token)
        secureLocalStorage.setItem(`id`, ModelidUserLogged)
        secureLocalStorage.setItem('NomeUnidade', NomeUnidade)
        secureLocalStorage.setItem('FotoUnidade', FotoUnidade)
        Router.push(`${plataform}`)
      }

     }
    }
  })

  const HandleClickPassword = async () =>{
     if(route === RotaMédico){
      Router.push(`/welcome/rec-password?person=medico`)
     }
     if(route === RotaPaciente){
      Router.push(`/welcome/rec-password?person=paciente`)
     }
     if(route === RotaUnidade){
      Router.push(`/welcome/rec-password?person=unidade`)
     }
  }

  const HandleClickCadastro = async () =>{
     Router.push(`/welcome/${secondRoute}/${treeRoute}`)
  }

  const HandleClick = async () => {
    try {
      await CreateRequestMutation.mutateAsync({
        email: email,
        senha: senha,
        route: route,
      })
  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setSnackbarMessage(`${apelido}, suas credenciais de login estão incorretas =/`);
      } else {
        setSnackbarMessage('');
      }
  
      handleSnackBarOpen();
    }
  };
  
  const HandleClickLogin = async () =>{
     if( email ==='' || senha === ''){
      setSnackbarMessage(`${apelido} Voce precisa preencher todos os dados de Login para poder entrar!`);
      handleSnackBarOpen();
     }else{
      HandleClick()
     }
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  return(
    <>
      <main className="flex">
        <section className="w-1/2 sm:hidden md:hidden lg:hidden">
              <Image
                src={ImagemLateral}
                alt="Imagem Login"
      
        />  
        </section>

        <section className="w-1/2 sm:w-full md:w-full lg:w-full">
        <div className='ml-8 relative top-11'><IconBack/></div>
          <div className='flex flex-col gap-9 sm:gap-7 md:gap-5 lg:gap-6 items-center justify-center'>
            <div className='flex'>
              <Image
              src={Logo}
              alt='Logo'
              height={150}
              width={150}
              className='animate-spin-slow'
              />
            </div>
            <h1 className='text-3xl text-center text-blue-500 font-'>{title}</h1>

            <div className="flex flex-col gap-8 py-2">
              <TextField
               label="Email"
               variant="standard"
               sx={{ width: '300px'}}
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               type="email"/>

              <TextField 
              label="Senha"
              variant="standard"
              sx={{ width: '300px'}}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type='password'/>

              <h3 className='font-bold cursor-pointer' 
              onClick={() => HandleClickPassword()}> 
              Esqueceu sua Senha?
              </h3>
            </div>

              <button className='w-72 h-12 rounded-full bg-indigo-950 text-white font-light' onClick={() => HandleClickLogin()}> 
              {CreateRequestMutation.isLoading  || ValidatorDoctor.isLoading || ValidatorPaciente.isLoading ?
               <CircularProgress size={24}/> 
               : MessageButton
               }
              </button>

              
              <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                  {snackbarMessage}
                </Alert>
              </Snackbar>

              <h3 className='font-bold'>Não tem uma conta? <span onClick={() => HandleClickCadastro()} className="text-blue-500 cursor-pointer">Cadastre agora!</span></h3>

              <Image
              src={SecondLogo}
              alt='SecondLogo'
              height={200}
              width={220}
              />            
            </div>
        </section>

      </main>
    </>
  )
}

export default Login