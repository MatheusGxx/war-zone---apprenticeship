'use client'
import { useState, useEffect } from 'react';
import Logo2 from '../public/Logo2.png';
import Image from 'next/image';
import { TextField, CircularProgress, Snackbar, Alert, Stack, SnackbarContent, Checkbox } from '@mui/material';
import IconBack from '../partials/IconBack.js';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query'
import { config } from '../config.js'
import { Autocomplete } from '@mui/material'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { format } from 'date-fns'
import { FormatPhoneNumber } from '../utils/FormatPhoneNumber'

const CadastroPacienteLead = ({ title,subtitle, ImagemLateral, apelido, mensagem}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dddPais, setDDDPais] = useState('55')
  const [number, setNumber] = useState('')
  const [sintomasandDoencas, setSintomasAndDoencas] = useState(null)
  const [doenca, setDoenca] = useState(null)
  const [okUTM, setOkUTM] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState([])
  
  useEffect(() => {

  },[acceptTerms, number])

  const params = useSearchParams()

  const Router = useRouter()

  const route = usePathname()
  
  const referrer = params.get('UTM_Referrer') 
  const funil = params.get('UTM_Funil') 
  const temp = params.get('UTM_Temp')  
  const rota = params.get('UTM_Rota')
  const source = params.get('UTM_Source') 
  const medium = params.get('UTM_Medium') 
  const campaign = params.get('UTM_Campaign') 
  const term = params.get('UTM_Term') 
  const content = params.get('UTM_Content')

  useEffect(() => {
    if(referrer && funil && temp && rota && source && medium && campaign && term && content){
      setOkUTM(true)
    }

  },[okUTM])

  
  const TrackingUTMAQ = useMutation(
    async (valueRequest) => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/api/tracking-utm-aq`, valueRequest)
        return response.data
      } catch (error) {
        console.error('Error in Tracking UTM AQ', error);
      }
    }
  )

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
      return response.data
    },
    {
      onSuccess: async (data)  => {  
        const { id, token, NomePaciente, Doenca } = data 
        secureLocalStorage.clear()
        secureLocalStorage.setItem('token', token)
        secureLocalStorage.setItem('id', id)
        secureLocalStorage.setItem('NomePaciente', NomePaciente)
        secureLocalStorage.setItem('StatusRegister', false)
        secureLocalStorage.setItem('Doenca', Doenca)


        const currentDate = new Date()
        const formattedDate = format(currentDate, 'dd/MM/yyyy')
        
        if(okUTM){
          await TrackingUTMAQ.mutateAsync({
            id: id,
            data: formattedDate, 
            UTM_Referrer: decodeURIComponent(referrer),
            UTM_Funil: decodeURIComponent(funil),
            UTM_Temp: decodeURIComponent(temp),
            UTM_Rota: decodeURIComponent(rota),
            UTM_Source: decodeURIComponent(source),
            UTM_Medium: decodeURIComponent(medium),
            UTM_Campaign: decodeURIComponent(campaign),
            UTM_Term: decodeURIComponent(term),
            UTM_Content: decodeURIComponent(content),
          })
          Router.push(`/especialistas-disponiveis?UTM_Referrer=${encodeURIComponent(referrer)}&UTM_Funil=${encodeURIComponent(funil)}&UTM_Temp=${encodeURIComponent(temp)}&UTM_Rota=${encodeURIComponent(rota)}&UTM_Source=${encodeURIComponent(source)}&UTM_Medium=${encodeURIComponent(medium)}&UTM_Campaign=${encodeURIComponent(campaign)}&UTM_Term=${encodeURIComponent(term)}&UTM_Content=${encodeURIComponent(content)}`);
        }else{
          Router.push('/especialistas-disponiveis')
        }
      },
    }
  )
  
  const HandleClick = async () => {
    try {
      const ConjuntingNumber = dddPais + number
      const NumberOriginal = ConjuntingNumber.replace(/[\s()]/g, '')

       await CreateRequestMutation.mutateAsync({
        nome: name,
        email: email,
        telefone: NumberOriginal,
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
    if (name === '' || email === '' || number === '' || doenca === null) {
      setSnackbarMessage(`Por favor ${apelido} preencha todos os dados de Cadastro`);
      handleSnackBarOpen();
    }else if(number.length < 14){
      setSnackbarMessage(`${apelido} o numero escrito acima precisa ter 11 digitos`)
      handleSnackBarOpen()
    }else if(acceptTerms.length === 0){
      setSnackbarMessage(`${apelido} Voce precisa Aceitar os termos de uso para se cadastrar no Interconsulta!`)
      handleSnackBarOpen()
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
     
     <div className='flex'>
  
        <div className='w-1/2 sm:w-full md:w-full lg:w-full h-screen flex justify-center items-center'>
        <section className="flex flex-col gap-8 justify-center items-center sm:gap-5 lg:gap-6 w-full">
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

        <div className='w-full flex justify-center items-center'>
        
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
            />
            }
            className="w-[400px] sm:w-8/12"
        />

        </div>
        
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



