import Logo from '../public/logo.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import Rating from '@mui/material/Rating'
import { TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { config } from '../config.js'

const ObrigadoPaciente = () => {
  const [ratingValue, setRatingValue] = useState(1)
  const [avaliacaoText, setAvaliacaoText] = useState('')
  const [empty, setEmpty] = useState(false)
  const [fotoPatient, setFotoPatient] = useState('')
  const [nomeMedico, setNomeMedico] = useState('')
  const [idMedico, setIdMedico] = useState('')
  const [slugDoctor, setSlugDoctor] = useState('')
  const router = useRouter()

  const IdentificadorConsultaLocal = secureLocalStorage.getItem('EndPaciente')
  const IdentificadorConsulta = IdentificadorConsultaLocal || ''

  const NomePacienteLocal = secureLocalStorage.getItem('NomePaciente')
  const NomePaciente = NomePacienteLocal || ''

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const getDoctor = useMutation(async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-medico-avaliations`, {
      IdentificadorConsulta,
    })
    const { getMedico } = response.data
    setIdMedico(getMedico[0]._id)
    setNomeMedico(getMedico[0].NomeEspecialista)
    setSlugDoctor(getMedico[0].Slug)
    return getMedico
  })

  const getDataPatient = useMutation(async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-data-patient`, {
      id,
    })
    setFotoPatient(response.data.FotoPaciente)
    return response.data.FotoPaciente
  })

  const avaliacaoDoctor = useMutation(async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/avaliation-doctor`, {
      id: idMedico,
      avaliacao: ratingValue,
      avaliacaoText,
      FotoPaciente: fotoPatient,
      NomePaciente,
    })
    return response.data
  })

  useEffect(() => {
    getDoctor.mutate()
    getDataPatient.mutate()
  }, [])

  const handleClickPatient = async () => {
    if (avaliacaoText === '') {
      setEmpty(true)
    } else {
      await avaliacaoDoctor.mutate()
      secureLocalStorage.removeItem('EndPaciente')
      router.push('/especialistas-disponiveis')
    }
  }

  return (
    <>
      {getDoctor.isLoading ? (
        <div className="flex justify-center items-center">
          <Image src={Logo} alt="Logo Interconsulta" width={100} height={100} className="animate-pulse" />
        </div>
      ) : (
        <div className="flex justify-center w-full sm:gap-0 sm:pt-0 -mt-5">
          <div className="flex flex-col w-full sm:w-full gap-3">
            <h1 className="font-bold text-4xl leading-tight sm:text-center sm:text-2xl text-center text-blue-900">
              {NomePaciente} Obrigado por Utilizar<br />os serviços do{' '}
              <span className="text-blue-500">#Interconsulta</span>
            </h1>
            <div className="w-full flex flex-col justify-center items-center gap-5">
              <h1 className="font-bold text-3xl text-blue-900 sm:text-center sm:text-2xl mt-3">
                Avaliar {nomeMedico}
              </h1>
              <div className="flex justify-center items-center sm:flex sm:justify-center mb-4 mt-5">
                {fotoPatient ? (
                  <Image
                    src={`${config.apiBaseUrl}/${fotoPatient}`}
                    alt="Foto do Paciente"
                    width={150}
                    height={150}
                    className="sm:rounded-full rounded-xl"
                  />
                ) : (
                  <Image
                    src={Logo}
                    alt="Logo Interconsulta"
                    width={150}
                    height={150}
                    className="sm:rounded-full rounded-xl"
                  />
                )}
              </div>
              <TextField
                variant="standard"
                label={`Avaliar ${nomeMedico}`}
                onChange={(e) => setAvaliacaoText(e.target.value)}
                value={avaliacaoText}
                type="text"
                className="w-1/2"
                error={empty}
                helperText={empty ? `${NomePaciente} a Avaliaçao do ${nomeMedico} é Obrigatória` : ''}
                required
              />
              <Rating
                name="size-large"
                value={ratingValue}
                onChange={(event, newValue) => {
                  setRatingValue(newValue)
