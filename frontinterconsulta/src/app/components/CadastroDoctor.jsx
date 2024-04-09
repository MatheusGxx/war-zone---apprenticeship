'use client'
import { useState, useEffect } from 'react';
import Logo from '../public/logo.png';
import Logo2 from '../public/Logo2.png';
import Image from 'next/image';
import { TextField, CircularProgress, Snackbar, Alert, Checkbox, Autocomplete } from '@mui/material'
import { TypesDoctors } from './TypesDoctors'
import IconBack from '../partials/IconBack.js';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query'
import { config } from '../config.js'
import { FormatPhoneNumber } from '../utils/FormatPhoneNumber'
import { EspecialidadesAtendidas } from "../partials/EspecialidadesAtendidas.js"
import { EspecialidadesUnidades } from '../partials/EspecialidadesUnidade'
import { AreadeAtuacaoAtendidas } from '../partials/AreadeAtuaçaoAtendidas'
import { TituloEspecialista } from '../partials/TituloEspecialista'
import ImagemLateral from '../public/ImageLogin.png'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const CadastroDoctor = ({ title, apelido }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [name, setName] = useState('')
  const [senha, setSenha] = useState('')
  const [email, setEmail] = useState('')
  const [dddPais, setDDDPais] = useState('55')
  const [number, setNumber] = useState('')
  const [acceptTerms, setAcceptTerms] = useState([])
  const [typeDoctor, setTypeDoctor] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [atuacao, setAtuacao] = useState('')
  const [valorConsulta, setValorConsulta] = useState('')
  const [titulo, setTitulo] = useState('')
  const [keyDoctor, setKeyDoctor] = useState('')

  const Router = useRouter()

  const route = usePathname()

  useEffect(() => {
    
  },[acceptTerms,number, typeDoctor])

  const[download, setDownload] = useState('')
    
  const getCodes = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/get-codes-units`)
      return response.data.codes
    } catch (error) {
      throw new Error('Erro ao fazer o download da planilha');
    }
  }

  const queryKey = ['codes', keyDoctor]
  const { data } = useQuery(queryKey, ()  => getCodes(keyDoctor))
  
  const EspeciliatyUnits = data ? EspecialidadesUnidades(data) : ['Carregando...']

  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/register`, valueRequest)
      return response.data
    },
    {
      onSuccess: (data) => { 
        const { token, _id, NomeMedico, Especialidade, TypeDoctorr } = data

        let utms = secureLocalStorage.getItem('utms')
        secureLocalStorage.clear()
        secureLocalStorage.setItem('token', token)
        secureLocalStorage.setItem('id', _id)
        secureLocalStorage.setItem('NomeMedico', NomeMedico)
        secureLocalStorage.setItem('TypeDoctor', TypeDoctorr)
        secureLocalStorage.setItem('Especialidade', Especialidade)
        secureLocalStorage.setItem('StatusRegister', false)
        secureLocalStorage.setItem('InitialContact', 'true')
        secureLocalStorage.setItem('utms', utms)

        Router.push(`/casos-clinicos`)
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
        typeDoctor: typeDoctor,
        especialidade: especialidade,
        AreaAtuacao: atuacao,
        valorConsulta: valorConsulta,
        tituloEspecialista: titulo
      });
    } catch (error) {
      setSnackbarMessage(`${apelido}, Email ou Telefone ja estao em uso por favor escolha outro telefone ou email`);
      handleSnackBarOpen();
    }
  }

  const HandleClickEnd = async () => {
    if (name === '' || senha === '' || email === '' || number === '' || typeDoctor === '' || especialidade === '' || valorConsulta === '' || titulo === '') {
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
  }

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
          setAcceptTerms((prev) => [...prev, value])
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
      <div className="flex w-full">
        <div className='w-1/2 sm:w-full md:w-full lg:w-full h-screen flex justify-center items-center'>
        <section className="flex flex-col gap-2 justify-center items-center">
        <Image
                src={Logo}
                alt="Imagem Login"
                width={50}
                height={50}
                className='animate-spin-slow'
         />
          <h1 className="text-blue-600 text-3xl sm: text-center sm:text-2xl">{title}</h1>

          <Autocomplete
            value={titulo === '' ? null : titulo}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setTitulo(newValue);
              }
            }}
            options={TituloEspecialista}
            noOptionsText="Sem resultados"
            renderInput={(params) => <TextField {...params} label="Titulo Especialista" variant="standard" />}
            sx={{ width: '400px' }}
            className="sm:w-8/12"
          />

          <TextField
            label="Como voce é conhecido"
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
            className="sm:w-6/12"
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

         <TextField
            label="Valor da Consulta"
            variant="standard"
            sx={{ width: '400px' }}
            className="sm:w-8/12"
            type="number"
            value={valorConsulta}
            onChange={(e) => setValorConsulta(e.target.value)}
            required
          />
          
        <Autocomplete
          value={typeDoctor === '' ? null : typeDoctor}
          onChange={(event, newValue) => {
            if (newValue !== null) {
              setTypeDoctor(newValue)
            }
          }}
          options={TypesDoctors}
          noOptionsText="Sem resultados"
          renderInput={(params) => <TextField {...params} label="Tipo de Atendimento" variant="standard" />}
          sx={{ width: '400px' }}
          className="sm:w-8/12"
          />

        <Autocomplete
            value={especialidade === '' ? null : especialidade}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setEspecialidade(newValue);
              }
            }}
            options={typeDoctor === 'Atendimento Público' ? EspeciliatyUnits : EspecialidadesAtendidas}
            noOptionsText="Sem resultados"
            renderInput={(params) => <TextField {...params} label="Especialidade Médica" variant="standard" />}
            sx={{ width: '400px' }}
            className="sm:w-8/12"
          />

        <Autocomplete
          value={atuacao === '' ? null : atuacao}
          onChange={(event, newValue) => {
            if (newValue !== null) {
                  setAtuacao(newValue);
              }
            }}
          options={AreadeAtuacaoAtendidas}
          noOptionsText="Sem resultados"
          renderInput={(params) => <TextField {...params} label="Área de Atuação Médica Principal" variant="standard" />}
          sx={{ width: '400px' }}
          className="sm:w-8/12"
        />

          <div className='flex justify-center items-center gap-3'>
            <Checkbox onChange={(event) => AcceptTermsOfUse(event, 'cheked')}  />
             <h1 className='whitespace-pre-wrap'> Li e estou de acordo com  o <span className='font-bold text-blue-500 cursor-pointer' onClick={() => HandleViewTermsOfUse()}> Termos de uso </span> e <span className='font-bold text-blue-500 cursor-pointer' onClick={() => HandleViewPrivacity()}> Politica de Privacidade </span></h1>
          </div>

      <button className={'w-72 h-12 rounded-full text-white font-light bg-indigo-950 '}
      onClick={() => HandleClickEnd()}
      disabled={CreateRequestMutation.isLoading || CreateRequestMutation.isSuccess}
      >

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
  )
}

export default CadastroDoctor
