import { TextField,  Snackbar, Alert, CircularProgress } from "@mui/material"
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import axios from 'axios'
import { config, Api2 } from "../config"
import { useMutation } from '@tanstack/react-query'
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const RecuperePassword = () => {
  
  const [email, setEmail] = useState('')
  const [insertToken, setInsertToken] = useState(false)
  const [code, setCode] = useState('')
  const [id, setID] = useState('')
  const [update, setUpdate] = useState(false)
  const [newPassword1, setNewPassword1] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'right'
  })

  const { vertical, horizontal } = position

  useEffect(() => {   

  },[insertToken, update])

  const router = useRouter()
  const params = useSearchParams()
  const person = params.get('person')

    
  const sendEmailCode = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${Api2.apiBaseUrl}/api2/send-email-recupere-password`, valueRequest)
      return response.data
    },
    {
      onSuccess: (data) => {
         setInsertToken(true)
      },
      onError: (err) => {
        if(err.response.data.notEmail){
          setSnackbarMessage(err.response.data.notEmail)
          handleSnackBarOpen()
        }else{
          setSnackbarMessage('Erro ao Enviar Email.')
          handleSnackBarOpen()
        }
      }
    }
  )

  const VerifyCode = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/validator-code-email`, valueRequest);
      return response.data
    },
    {
      onSuccess: (data) => {
        const { id } = data
        setID(id)
        setInsertToken(false)
        setUpdate(true)
      },
      onError: (err) => {
        if(err.response.data.notCode){
          setSnackbarMessage('O Codigo esta expirado =/')
          handleSnackBarOpen()
        }else{
          setSnackbarMessage('Um erro ocorreu ao analisar o codigo')
          handleSnackBarOpen()
        }
      }
    }
  )

  const UpdatePassword = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/update-password`, valueRequest);
      return response.data
    },
     {
      onSuccess: (data) => {

      },
      onError: (err) => {
        setSnackbarMessage('Ocorreu um Erro ao Atualizar a sua Senha =/')
        handleSnackBarOpen()
      }
     }
  )

  const HandlesendEmailCode = async () => {
    await sendEmailCode.mutateAsync({ email, person })
  }

  const HandleVerifyCode = async () => {

    if(code === ''){
      setSnackbarMessage('Campo do Codigo esta Vazio...')
      handleSnackBarOpen()
    }else{
      await VerifyCode.mutateAsync({ code, person })
    }
  }

  const HandleUpdatePassword = async () => {
    if(newPassword1 === newPassword2){
      await UpdatePassword.mutateAsync({ id, newPassword: newPassword2, person })
    }else{
      setSnackbarMessage('As senhas nao estão iguais, digite senhas iguais nos 2 campos abaixo')
      handleSnackBarOpen()
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  }

  const handleSnackBarOpen = () =>{
    setSnackbarOpen(true)
  }

  const HandleLogin = () => {

     if(person === 'medico'){
      router.push(`/welcome/login-medico`)
     }

     if(person === 'paciente'){
      router.push(`/welcome/login-paciente`)
     }

     if(person === 'unidade'){
      router.push(`/welcome/login-unidade`)
     }
   
  }

  const HandleLoginInitial = () => {
    router.push('/welcome')
  }

  const handleCodeChange = (e) => {
    const inputValue = e.target.value;

    const newValue = inputValue.replace(/\s/g, ''); // Remove todos os espaços
    setCode(newValue);
    
  };

    return(
        <>
         <div className='container'>
        <section className="flex flex-col gap-11 justify-center items-center sm:gap-8 lg:gap-10">
            <Image
              src={Logo}
              alt='Logo Interconsulta'
              height={150}
              width={150}
              className='animate-spin-slow'
            />

            {!person &&
            <>
              <h1 className="text-blue-600 text-3xl text-center"> Voce Precisa vir de uma Tela de Login para acessar essa tela </h1>
            <button 
            className='w-72 h-12 rounded-full bg-indigo-950 text-white font-light'
            >
              <p className="font-bold text-white" onClick={() => HandleLoginInitial()}> Entrar </p>
            </button>
            </>
            }

            {!insertToken && !update && person &&
            <>
             <h1 className='text-blue-600 text-3xl text-center'>Coloque o seu Email e recupere <br/> a sua senha agora mesmo!</h1>
              <TextField 
              id="standard-basic" 
              label="Email"
              variant="standard"
              sx={{ width: '300px'}}
              type="email"
              InputProps={{
                sx: { borderBottom: "1px solid blue" },
              }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              />
              <button 
              className='w-72 h-12 rounded-full bg-indigo-950 text-white font-light'
              onClick={() => HandlesendEmailCode()}
              disabled={sendEmailCode.isLoading}
              >
              {sendEmailCode.isLoading ? <CircularProgress size={24}/> : 'Recuperar Senha'}
              </button>
                <Image
                src={Logo2}
                alt="Logo 2 Interconsulta"
                height={200}
                width={220}
              />
            </>
            }

            {insertToken && 
            <>
            <div className="w-1/2 border border-blue-500 flex flex-col justify-center items-center gap-10 p-5 sm:w-10/12">
            <h1 className='text-blue-600 text-3xl text-center font-semibold'>
              Verifique o seu Email! 
            </h1>
            <h2 className="text-blue-600 text-xl">             
              Enviamos um código para o e-mail <br/> {email} Insira-o abaixo.
            </h2>
            <TextField 
              id="standard-basic" 
              label="Codigo"
              variant="outlined"
              sx={{ width: '300px'}}
              type="text"
              onChange={(e) => handleCodeChange(e)}
              value={code}
              InputProps={{
                sx: { border: "1px solid blue" },
              }}
              required
              />

             <button 
             className='w-72 h-12 rounded-full bg-indigo-950 text-white font-light' 
             onClick={() => HandleVerifyCode()}
             disabled={VerifyCode.isLoading}
             > 
              {VerifyCode.isLoading ? <CircularProgress size={24}/> : 'Continuar'}
              </button>
            </div>
            </>
            }

            {update &&
            <>
               <div className="w-1/2 border border-blue-500 flex flex-col justify-center items-center gap-10 p-5 sm:w-10/12">
                 
               <h1 className="text-blue-600 text-3xl text-center font-semibold">  Crie a sua nova senha </h1>

               <h1 className="text-blue-600 text-xl"> Pediremos sua senha toda vez que fizer login </h1>

                <TextField 
                id="standard-basic" 
                label="Insira a Nova Senha"
                variant="outlined"
                sx={{ width: '300px'}}
                type="text"
                onChange={(e) => setNewPassword1(e.target.value)}
                value={newPassword1}
                InputProps={{
                  sx: { border: "1px solid blue" },
                }}
                required
                />

              <TextField 
                  id="standard-basic" 
                  label="Insira a senha nova mais uma vez"
                  variant="outlined"
                  sx={{ width: '300px'}}
                  type="text"
                  onChange={(e) => setNewPassword2(e.target.value)}
                  value={newPassword2}
                  InputProps={{
                    sx: { border: "1px solid blue" },
                  }}
                  required
                  />

                <button 
                className={`w-72 h-12 rounded-full
                 ${UpdatePassword.isSuccess ? 'bg-green-600' : 'bg-indigo-950'} text-white font-light`
                }
                onClick={() => HandleUpdatePassword()}
                disabled={UpdatePassword.isLoading || UpdatePassword.isSuccess}
                > 
                  {UpdatePassword.isLoading ? 
                  <CircularProgress size={24}/> 
                  : UpdatePassword.isSuccess ? 'Senha Alterada com Sucesso' : 'Salvar Alteraçoes'
                  }
                </button>

                {UpdatePassword.isSuccess &&
                   <div 
                   className="flex justify-center items-center gap-3 cursor-pointer" 
                   onClick={() => HandleLogin()}>
                    <KeyboardTabIcon color="primary"/>
                    <h1> Voltar para a tela de Login </h1>
                   </div>
                 }

                

               </div>            
            </>
            }
        </section>
      </div>

        <Snackbar
            open={snackbarOpen} 
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical, horizontal }}
          >
          <Alert onClose={handleSnackbarClose} severity="error">
              {snackbarMessage}
          </Alert>
          </Snackbar>
        </>
    )
}


export default RecuperePassword