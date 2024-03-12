'use client'
import { useState, useEffect } from 'react';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png';
import Image from 'next/image';
import { TextField, CircularProgress, Snackbar, Alert, Stack, SnackbarContent } from '@mui/material';
import IconBack from '../partials/IconBack.js';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query'
import { config } from '../config.js'
import { Autocomplete } from '@mui/material'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'


const CadastroPacienteLead = ({ title,subtitle, ImagemLateral, apelido, mensagem}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('55')
  const [sintomasandDoencas, setSintomasAndDoencas] = useState(null)
  const [doenca, setDoenca] = useState(null)

  const Router = useRouter()

  const route = usePathname()

  const getSintomasAndDoencas = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/get-sintomas-doencas`, valueRequest)
      setSintomasAndDoencas(response.data.arr)
      return response.data
    }
  )

  useEffect(() => {
    getSintomasAndDoencas.mutateAsync()
  }, [])


  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/register`, valueRequest)
      console.log(response.data)
      return response.data
    },
    {
      onSuccess: (data)  => {  
        const { id, token, NomePaciente, Doenca } = data 
        secureLocalStorage.setItem('token', token)
        secureLocalStorage.setItem('id', id)
        secureLocalStorage.setItem('NomePaciente', NomePaciente)
        secureLocalStorage.setItem('Doenca', Doenca)

        Router.push(`/especialistas-disponiveis`)
      },
    }
  )
  
  const HandleClick = async () => {
    try {
       await CreateRequestMutation.mutateAsync({
        nome: name,
        email: email,
        telefone: number,
        doenca: doenca,
        route: route,
      })
      secureLocalStorage.setItem('InitialContact', 'true')
    } catch (error) {
      setSnackbarMessage(`${apelido}, Email ou Telefone ja estao em uso por favor escolha outro telefone ou email`);
      handleSnackBarOpen()
    }
  }

  const HandleClickEnd = async () => {
    if (name === '' || email === '' || number === '') {
      setSnackbarMessage(`Por favor ${apelido} preencha todos os dados de Cadastro`);
      handleSnackBarOpen();
    } else {
      HandleClick();
    }
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  const OnChangeInputNumber = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    // Se o valor não começar com "55", mantenha "55" no início
    const formattedValue = newValue.startsWith('55') ? newValue : '55' + newValue.substring(2)
    // Define o valor no estado
    setNumber(formattedValue);
  };

  return (
    <>
     
     <div className='flex'>
  
        <div className='w-1/2 sm:w-full md:w-full lg:w-full'>
        <section className="flex flex-col gap-10 justify-center items-center sm:gap-5 lg:gap-6 mt-16">
          <div className="justify-center items-center">
            <Image src={Logo2} alt="Logo Interconsulta" height={250} width={250}  />
          </div>

          <Image
                src={ImagemLateral}
                alt="Imagem Login"
                className='hidden sm:block md:block lg:block rounded-full'
                height={60}
                width={60}
      
          />

          <h1 className="text-blue-600 text-3xl sm:text-center sm:text-2xl"> {title} </h1>
          <h1 className='text-blue-600 text-2xl sm:text-center sm:text-xl'> {subtitle}</h1>

          <TextField
            label="Nome Completo"
            variant="standard"
            sx={{ width: '300px' }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

        <TextField
            label="Seu e-mail de uso"
            variant="standard"
            sx={{ width: '300px' }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Whatsapp para contato ex: 11893724023"
            variant="standard"
            sx={{ width: '300px' }}
            type="tel"
            value={number}
            inputMode="numeric" // Especifica o modo de entrada numérica
            pattern="^55\d*$" // Usa uma expressão regular para permitir apenas números começando com "55"
            onChange={OnChangeInputNumber}
            required
          />

          <Autocomplete
             value={doenca === '' ? null : doenca}
             onChange={(event, newValue) => {
              if (newValue !== null) {
                  setDoenca(newValue);
                 }
              }}
             options={sintomasandDoencas}
             noOptionsText="Sem resultados"
             renderInput={(params) => <TextField {...params} label="Doença" variant="standard" 
             sx={{ width: '300px' }}
            />
            }
             />

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

        <section className="w-1/2 sm:hidden md:hidden lg:hidden">
              <Image
                src={ImagemLateral}
                alt="Imagem Login"
      
      />
        </section>
     </div>

    </>
  );
};

export default CadastroPacienteLead



