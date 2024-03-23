'use client'
import { useState, useEffect } from 'react';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png';
import Image from 'next/image';
import { TextField, CircularProgress, Snackbar, Alert, Stack, SnackbarContent, Checkbox } from '@mui/material';
import IconBack from '../partials/IconBack.js';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query'
import { config } from '../config.js'
import { FormatPhoneNumber } from '../utils/FormatPhoneNumber';
import axios from 'axios'

const Cadastro = ({ title, OneRoute, SecondRoute, TreeRoute, apelido, mensagem}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [name, setName] = useState('')
  const [senha, setSenha] = useState('')
  const [email, setEmail] = useState('')
  const [dddPais, setDDDPais] = useState('55')
  const [number, setNumber] = useState('')
  const [acceptTerms, setAcceptTerms] = useState([])

  const Router = useRouter()

  const route = usePathname()

  useEffect(() => {
    
  },[acceptTerms,number])

  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/register`, valueRequest);
      return response.data._id
    },
    {
      onSuccess: (id) => {  
        Router.push(`/welcome/${OneRoute}/${SecondRoute}/${TreeRoute}?id=${id}&name=${name}`)
      },
    }
  )
  

  const HandleClick = async () => {
    try {
        const ConjuntingNumber = dddPais + number
        const NumberOriginal = ConjuntingNumber.replace(/[\s()]/g, '')

        await CreateRequestMutation.mutateAsync({
        nome: name,
        senha: senha,
        email: email,
        telefone: NumberOriginal,
        route: route,
      });
    } catch (error) {
      setSnackbarMessage(`${apelido}, Email ou Telefone ja estao em uso por favor escolha outro telefone ou email`);
      handleSnackBarOpen();
    }
  }

  const HandleClickEnd = async () => {
    if (name === '' || senha === '' || email === '' || number === '') {
      setSnackbarMessage(`Por favor ${apelido} preencha todos os dados de Cadastro`);
      handleSnackBarOpen();
    }else if(number.length < 14){
      setSnackbarMessage(`${apelido} o numero escrito acima precisa ter 11 digitos`)
      handleSnackBarOpen()
    }else if(acceptTerms.length === 0){
      setSnackbarMessage(`${apelido} Voce precisa Aceitar os termos de uso para se cadastrar no Interconsulta!`);
      handleSnackBarOpen();
    }else {
      HandleClick()
    }
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  const OnChangeInputNumber = (e) => {

    const formattedNumber = FormatPhoneNumber(e.target.value);
    setNumber(formattedNumber)
  }

   const AcceptTermsOfUse = (event, value) => {
        if (event.target.checked) {
          setAcceptTerms((prev) => [...prev, value]);
        } else {
          setAcceptTerms((prev) => prev.filter((accept) => accept !== value))
        }
    }

   const HandleViewTermsOfUse = () => {
      Router.push('/termos')
    }
    
    const HandleViewPrivacity = () => {
      Router.push('/privacidade')
     }



  return (
    <>
      <div className="container">
        <div className="pl-10 relative top-10">
          <IconBack />
        </div>
        <section className="flex flex-col gap-8 justify-center items-center sm:gap-5 lg:gap-6 -mt-4">
          <div className="justify-center items-center">
            <Image src={Logo} alt="Logo Interconsulta" height={150} width={150} className="animate-spin-slow" />
          </div>

          <h1 className="text-blue-600 text-3xl sm: text-center sm:text-2xl">{title}</h1>

          <TextField
            label="Nome Completo"
            variant="standard"
            sx={{ width: '400px' }}
            className="sm:w-8/12"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <TextField
            label="Seu e-mail de uso"
            variant="standard"
            sx={{ width: '400px' }}
            className="sm:w-8/12"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

         <div className='flex gap-4 justify-center items-center'>
        <TextField
            label="DDD Pais"
            variant="standard"
            className='w-1/6'
            InputProps={{
              inputProps: {
                  style: {
                      textAlign: "center", // Centraliza o texto horizontalmente
                  },
              },
              readOnly: true
          }}
            type="tel"
            value={dddPais}
            inputMode="numeric" // Especifica o modo de entrada numérica
          />

          <TextField
            label="Whatsapp para contato ex: 11893724023"
            variant="standard"
            sx={{ width: '300px' }}
            className="sm:w-7/12"
            type="tel"
            value={number}
            inputMode="numeric" // Especifica o modo de entrada numérica
            onChange={OnChangeInputNumber}
            required
          />
        </div>

          <TextField
            label="Sua melhor Senha"
            variant="standard"
            sx={{ width: '400px' }}
            className="sm:w-8/12"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className='flex justify-center items-center gap-3'>
            <Checkbox onChange={(event) => AcceptTermsOfUse(event, 'cheked')}  />
             <h1> Li e estou de acordo com  o <span className='font-bold text-blue-500 cursor-pointer' onClick={() => HandleViewTermsOfUse()}> Termos de uso </span> e <span className='font-bold text-blue-500 cursor-pointer' onClick={() => HandleViewPrivacity()}> Politica de Privacidade </span></h1>
          </div>

      <button className={'w-72 h-12 rounded-full text-white font-light bg-indigo-950 '}
      onClick={() => HandleClickEnd()}>

      {CreateRequestMutation.isLoading ? <CircularProgress size={24}/> : 'Cadastre - se'}

      </button>
            
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="error">
              {snackbarMessage}
            </Alert>
          </Snackbar>

        </section>
      </div>
    </>
  )
}

export default Cadastro;
