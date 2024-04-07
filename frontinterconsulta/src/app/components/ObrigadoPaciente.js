'use client'
import Logo from '../public/logo.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import Rating from '@mui/material/Rating'
import { TextField } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { config, Api2 } from '../config.js'

const ObrigadoPaciente = () => {

  const [ratingValue, setRatingValue] = useState(0)
  const [idMedico, setidMedico] = useState(null)
  const [avaliacaoText, setAvaliacaoText] = useState('')
  const [NomeMedico, setNomeMedico] = useState('')
  const [empty, setEmpty] = useState(false)
  const [fotoPatient, setFotoPatient] = useState(null)

  const params = useSearchParams()

  const EndPacienteParams = params.get('idC')
  const NomePacienteParams = params.get('nome')
  const idParams = params.get('id')

  const IdentificadorConsultaLocal = secureLocalStorage.getItem('EndPaciente') || decodeURIComponent(EndPacienteParams)
  const IdentificadorConsulta = IdentificadorConsultaLocal || ''

  const NomePacienteLocal = secureLocalStorage.getItem('NomePaciente') || decodeURIComponent(NomePacienteParams)
  const NomePaciente = NomePacienteLocal || ''

  const idLocal = secureLocalStorage.getItem('id') || decodeURIComponent(idParams)
  const id = idLocal || ''

  const[slugDoctor, setSlugDoctor] = useState('')

  const Router = useRouter()

  const getDoctor = useMutation( async (valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/get-medico-avaliations`, valueBody)
    setidMedico(request.data.getMedico.map((data) => data._id))
    setNomeMedico(request.data.getMedico.map((data) => data.NomeEspecialista))
    setSlugDoctor(request.data.getMedico.map((data) => data.Slug))
    return request.data.getMedico
  })
  const AvaliationsDoctor = useMutation( async (valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/avaliation-doctor`, valueBody)
    return request.data
  })

  const getDataPatient = useMutation(async (valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/get-data-patient`, valueBody)
    setFotoPatient(request.data.FotoPaciente)
    return request.data.FotoPaciente
  })

  const RecupereAvaliationDoctor = useMutation( async (valueBody) =>{
    try{
      const request = await axios.post(`${Api2.apiBaseUrl}/api2/recupere-avaliation-doctor`, valueBody)
      return request.data
    }catch(err){
      console.log(err)
    }
  })

  useEffect(() =>{
    const body = {
      IdentificadorConsulta: IdentificadorConsulta
    }
    getDoctor.mutateAsync(body)

    const body2 = {
     idPaciente: id 
    }

    getDataPatient.mutateAsync(body2)
  },[])

  const HandleClickPatient = async () => {

    if(avaliacaoText === ''){
        setEmpty(true)
    }else{
      await AvaliationsDoctor.mutateAsync({
         id: idMedico, 
         avaliacao: ratingValue, 
         avaliacaoText: avaliacaoText,
         FotoPaciente: fotoPatient,
         NomePaciente: NomePaciente
         })
      secureLocalStorage.removeItem('EndPaciente')
      Router.push('/especialistas-disponiveis')

      if(ratingValue === 0) RecupereAvaliationDoctor.mutateAsync({ id: idLocal })
    } 
  }

  return(
   <> 
   {getDoctor.isLoading ? 
     <div className=' min-h-screen flex justify-center items-center'>
     <Image src={Logo} alt="Logo Interconsulta" width={100} height={100} className='animate-pulse'/>
     </div>
     :
    <>
   <div className='min-h-screen flex justify-center items-center w-full sm:gap-0 sm:pt-0 flex-col'>

      <h1 className="font-bold text-4xl leading-tight sm:text-center sm:text-2xl text-center text-blue-900">{NomePaciente} Obrigado por Utilizar<br/>os serviços do <span className="text-blue-500">#Interconsulta</span></h1>
      <div className='w-full flex flex-col justify-center items-center gap-5'>
      <h1 className='font-bold text-3xl text-blue-900 sm:text-center sm:text-2xl mt-3'>
          {getDoctor.data?.map((data, index) => (
            <span key={index}>
              Avaliar {data.NomeEspecialista}
            </span>
          ))}
        </h1>

        {getDoctor.data?.map((medico, index) => (
           <div key={index} className="cursor-pointer flex flex-col">
               <div className="flex justify-center items-center sm:flex sm:justify-center mb-4 mt-5">
                {medico.Foto ?
                  <Image src={`${config.apiBaseUrl}/${medico.Foto}`} alt="Foto do Médico" width={150} height={150} className="sm:rounded-full rounded-xl" />
                  : 
                  <Image src={Logo} alt="Logo Interconsulta" width={150} height={150} className="sm:rounded-full rounded-xl" />
                }
            </div>
           <div className="flex justify-center gap-3">
             <p className="sm:text-center text-center text-blue-500 font-bold">{medico.NomeEspecialista}</p>
           <div className="mt-1 flex justify-center items-center">
           <div className="bg-green-500 rounded-full h-2 w-2"></div>
         </div>
        </div>
             </div>
        ))}
        
        <TextField
           variant="standard"
           label={`Avaliar ${NomeMedico}`}
        
           onChange={(e) => setAvaliacaoText(e.target.value)}
           value={avaliacaoText}
           type="text"
           className="w-1/2"
           error={empty} 
           helperText={empty ? `${NomePaciente} a Avaliaçao do ${NomeMedico} é Obrigatória` : ''}
           required
         />

        <Rating name="size-large" 
        value={ratingValue}
        onChange={(event, newValue) => {
          setRatingValue(newValue)
        }}
        size="large" 
        />

          <div className=' flex gap-10 sm:flex sm:justify-center sm:items-center lg:flex justify-center
          lg:items-center xl:flex xl:justify-center'>
          <button
           className="w-72 h-12 rounded-full bg-indigo-950 text-white font-bold  animate-pulse"
           onClick={HandleClickPatient}
           > Finalizar Avaliação
          </button>

          <button
           className="w-72 h-12 rounded-full bg-indigo-950 text-white font-bold  animate-pulse"
           >
            <p className='sm:text-sm text-center whitespace-nowrap'> 
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Perfil Médico:')} ${encodeURIComponent(`https://agendamedica.digital/especialista/${slugDoctor}?utm_source=whatzapp&utm_medium=convite`)}`} 
             target='_blank'> 
              Compartilhar Perfil do {NomeMedico}
            </a>
          </p>
          </button>
        </div>
        </div>

        </div>
    </>
     }
   </>
  )
}

export default ObrigadoPaciente
