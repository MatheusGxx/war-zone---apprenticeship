'use client'
import { Autocomplete, TextField } from "@mui/material";
import { useMutation } from '@tanstack/react-query'
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'
import axios from 'axios';
import Image from "next/image";
import iconNull from '../public/IconNull.png'
import Logo from '../public/logo.png'
import AgendamentoConsulta from "../partials/Agendamento";
import secureLocalStorage from 'react-secure-storage'
import Rating from '@mui/material/Rating'
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EndRegisterPatient  } from "../partials/PopUpEndCadastroPaciente"
import { useEndRegister } from '../context/context.js'
import { config } from '../config.js'
import { ComponenteAudio } from "../partials/ComponentAudio"
import { useBlood } from "../context/context.js"
import { PopUpBlood } from "../partials/PopUpBlood"

const ContentPaciente = () => {
  const[selectedDoenca, setSelectedDoenca] = useState('')
  const[especialidade, setEspecialidade] = useState(null)
  const[nameProfissional, setNomeProfissional] = useState(null)
  const[medicoSlug, setMedicoSlug] = useState(null)
  const[Horarios, setHorarios] = useState()
  const[idMedico, setIDMedico] = useState(null)
  const[idDoctor, setIDDoctor] = useState(null)
  const[token, setToken] = useState('')
  const[logged, setLogged] = useState(false)
  const[shouldShowPopup, setShouldShowPopup] = useState(false)
  const[poolingDoctor, setPoolingDoctor] = useState('')
  const[readOnlyMode, setReadOnlyMode] = useState(true)
  const[sintomasandDoencas, setSintomasAndDoencas] = useState(null)
  const[valorConsulta, setValorConsulta] = useState(null)
  const[fotoMedico, setFotoMedico] = useState(null)
  const[avaliacoesDoctor, setAvaliacoesDoctor] = useState(null)
  const[endRegister, setEndRegister] = useState(false)
  const[isValid, setIsValid] = useState(null)
  const { blood } = useBlood()

  const queryClient = useQueryClient()
  const { registerEndOk } = useEndRegister()

  const DoencaLocal = secureLocalStorage.getItem('Doenca') 

  const DoencaLabel = DoencaLocal ? DoencaLocal : 'Doenças e Sintomas'

  const DoencaRouteDinamic = DoencaLocal || ''

  const Router = useRouter()

  const idLocal =  secureLocalStorage.getItem('id') 

  const id = idLocal || ''

  const RegisterSucessPatient = secureLocalStorage.getItem('RegisterSucessPatient')

  const InitialContant = secureLocalStorage.getItem('InitialContact')

  const VerifyDataPatient = useMutation(
    async (valueRequest) => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/api/verify-data-patient`, valueRequest)
        setIsValid(response.data.valid)
        return response.data.valid
      } catch (error) {
        console.error('Error in VerifyDataPatient:', error);
      }
    }
  )

  useEffect(() =>{
    const Token = secureLocalStorage.getItem('id')
    setToken(Token)
  },[])

  useEffect(() => {
    if (DoencaLocal) {
      const body = {
        doenca: DoencaRouteDinamic,
      }
      CreateRequestMutation.mutateAsync(body)
    }
  }, [DoencaLocal, DoencaLabel])

  useEffect(() => {
    const fetchData = async () => { 
      if (selectedDoenca !== '') {
        const body = {
          doenca: selectedDoenca,
          id: id
        };
        
        try {
          const Data = await CreateRequestMutation.mutateAsync(body);
          const NewDoenca = Data.NewDoenca
          secureLocalStorage.removeItem('Doenca')
          secureLocalStorage.setItem('Doenca', NewDoenca)
          setShouldShowPopup(false)
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }
  
    fetchData()
  }, [selectedDoenca])
  
  useEffect(() => {
      getSintomasAndDoencas.mutateAsync()
  }, [])

  useEffect(() => {
   
  },[logged])

  useEffect(() => {
    const UpdateDataPatient = async () => {
      if (!RegisterSucessPatient) {
        await VerifyDataPatient.mutateAsync({ id: id });
      }
    };
  
    UpdateDataPatient();
  }, [RegisterSucessPatient])
  
  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/especialidades`, valueRequest);
      const ids = response.data.ModelPaciente.map(item => item._id)
      setIDDoctor(ids)
      return response.data
    }
  )
  const getSintomasAndDoencas = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/get-sintomas-doencas`, valueRequest)
      setSintomasAndDoencas(response.data.arr)
      return response.data
    }
  );
  const HandleNavigation = async (
    Especialidade, 
    nameProfissional, 
    SlugMedico, 
    Horarios,
    idMedico, 
    slug, 
    fotoMedico,
    ValorConsulta,
    Avaliacoes
    )   => {

    if(token !== null){  // Se tiver Logado
      if(isValid === false){
       setEndRegister(true)
       setEspecialidade(Especialidade)
       setNomeProfissional(nameProfissional)
       setMedicoSlug(SlugMedico)
       setHorarios(Horarios)
       setIDMedico(idMedico)
       setFotoMedico(fotoMedico)
       setValorConsulta(ValorConsulta)
       setAvaliacoesDoctor(Avaliacoes)
      }else if(RegisterSucessPatient){
        setLogged(true)
        setEspecialidade(Especialidade)
        setNomeProfissional(nameProfissional)
        setMedicoSlug(SlugMedico)
        setHorarios(Horarios)
        setIDMedico(idMedico)
        setFotoMedico(fotoMedico)
        setValorConsulta(ValorConsulta)
        setAvaliacoesDoctor(Avaliacoes)
      }
    }else{  // Se nao tiver Logado 

      DoencaRouteDinamic && id
      ? 
      Router.push(`/especialista/${slug}`)
      :
      Router.push(`/especialista/${slug}`)
   
    }
  }

  /*const PoolingStateDoctor = async (idDoctor) => {
    const response = await axios.get('${config.apiBaseUrl}/api/verify-status', { params: { id: idDoctor } });
    return response.data;
  };
  
  const { data, isFetching, isError, isSuccess } = useQuery(
    ['PoolingDoctor', poolingDoctor],
    () => PoolingStateDoctor(idDoctor),
    {
      enabled: !!idDoctor,
    }
  )*/

  return (
    <>
      <div className="flex gap-6 items-center mt-1 ml-7 sm:ml-0 sm:justify-center md:justify-center md:ml-0">
        <h1 className="text-blue-900 font-bold pt-2 sm:hidden md:hidden lg:text-sm">
          Nos conte o que voce esta Sentido:
          </h1>

        <Autocomplete
          value={selectedDoenca === '' ? null : selectedDoenca}
          onChange={(event, newValue) => {
            if (newValue !== null) {
              setSelectedDoenca(newValue);
            }
          }}
          options={sintomasandDoencas}
          noOptionsText="Sem resultados"
          renderInput={(params) => <TextField {...params} label={DoencaLabel} variant="standard" />}
          className="w-1/2 border-b border-blue-500 sm:w-11/12"
        />
      
      </div>

      <div 
        className="border-b border-l
        border-r rounded-b-lg w-11/12 mx-auto mt-4 mb-2">
      </div>

      {CreateRequestMutation.isLoading && (
        <div className="flex justify-center items-center">
          <Image src={Logo} alt="Logo Interconsulta" height={100} width={100} className="animate-pulse"/>
        </div>
      )}

      {DoencaLocal !== null ? (
        <div className="flex justify-center">
          {CreateRequestMutation.isError ? (
                <div className="flex justify-center items-center text-xl gap-3 sm:flex sm:flex-wrap sm:text-base md:flex md:flex-col">
                  <h1> Médico Não disponível no Momento </h1>
                  <Image src={iconNull} alt="Médico não está disponível no momento" width={50} height={50} />
                </div>
              ) : CreateRequestMutation.isSuccess ? (
                <div className="flex gap-7 flex-wrap  justify-center items-center sm:gap-10">
                  {CreateRequestMutation.data.ModelPaciente.map((medico, index) => (
                    <div key={index} onClick={() =>
                     HandleNavigation(
                      medico.EspecialidadeMedica, 
                      medico.NomeEspecialista,
                      medico.Slug, 
                      medico.Horarios,
                      medico._id, 
                      medico.Slug,
                      medico.Foto,
                      medico.PrecoConsulta,
                      medico.mediaAvaliacoes
                      )} 
                     className="cursor-pointer flex flex-col justify-center items-center border-blue-500 border-2 rounded-lg p-2">
                      <div className="sm:flex sm:justify-center mb-4">
                        {medico.Foto ? 
                         <Image src={`${config.apiBaseUrl}/${medico.Foto}`} alt="Foto do Médico" width={100} height={100} className="sm:rounded-full rounded-xl" /> 
                         : 
                         <Image src={Logo} alt="Foto do Médico" width={100} height={100} className="sm:rounded-full rounded-xl" />
                        }
                      </div>
                      <div className="flex gap-3 justify-center items-center">
                        <p className="sm:text-center text-center text-blue-500 font-bold">{medico.NomeEspecialista}</p>
                        <div className="mt-1">
                         <div className="bg-green-500 rounded-full h-2 w-2"></div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center flex-col">
                      <p className="text-center sm:text-center text-blue-900"> {medico.EspecialidadeMedica}</p>
                      <p className="text-center sm:text-center text-blue-900"> {medico.AreadeAtuacao}</p>
                      </div>
                      <Rating name="simple-controlled"value={medico.mediaAvaliacoes}readOnly={readOnlyMode}/>
                    </div>
                  ))}

                  {logged && 
                  <>
                 <AgendamentoConsulta 
                  EspecialidadeMedica={especialidade}
                  titleButon={nameProfissional ? `Agendar com ${nameProfissional}` : 'Agendar consulta'}
                  DoencaAutoComplete={selectedDoenca}
                  SlugRoute={ medicoSlug }
                  Horarios={Horarios}
                  idMedico={idMedico}
                  NomeMedico={nameProfissional ? nameProfissional : ''}
                  ValorConsulta={valorConsulta}
                  FotoMedico={fotoMedico}
                  avaliacoes={avaliacoesDoctor}
                  onClose={() => setLogged(false)}
                  />
                  </>
                  }
                </div>
              ) : null}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-3">
          {selectedDoenca === '' ? (
            <Image src={Logo} alt="Logo Interconsulta" height={100} width={100} className="animate-spin-slow" />
          ) : (
            <div className="flex justify-center">
              {CreateRequestMutation.isError ? (
                <div className="flex justify-center items-center text-xl gap-3 sm:flex sm:flex-wrap sm:text-base md:flex md:flex-col">
                  <h1> Médico Não disponível no Momento </h1>
                  <Image src={iconNull} alt="Médico não está disponível no momento" width={50} height={50} />
                </div>
              ) : CreateRequestMutation.isSuccess ? (
                <div className="flex gap-7 flex-wrap justify-center items-center sm:gap-10">
                  {CreateRequestMutation.data.ModelPaciente.map((medico, index) => (
                    <div key={index} onClick={() =>
                     HandleNavigation(
                      medico.EspecialidadeMedica, 
                      medico.NomeEspecialista,
                      medico.Slug, 
                      medico.Horarios,
                      medico._id, 
                      medico.Slug,
                      medico.Foto,
                      medico.PrecoConsulta,
                      medico.mediaAvaliacoes
                      )} 
                     className="cursor-pointer flex flex-col justify-center items-center">
                      <div className="sm:flex sm:justify-center mb-4">
                      {medico.Foto ? 
                         <Image src={`${config.apiBaseUrl}/${medico.Foto}`} alt="Foto do Médico" width={100} height={100} className="sm:rounded-full rounded-xl" /> 
                         : 
                         <Image src={Logo} alt="Foto do Médico" width={100} height={100} className="sm:rounded-full rounded-xl" />
                      }
                      </div>
                      <div className="flex gap-3 justify-center items-center">
                        <p className="sm:text-center text-center text-blue-500 font-bold">{medico.NomeEspecialista}</p>
                        <div className="mt-1"> 
                      
                         <div className="bg-green-500 rounded-full h-2 w-2"></div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center flex-col">
                      <p className="text-center sm:text-center text-blue-900"> {medico.EspecialidadeMedica}</p>
                      <p className="text-center sm:text-center text-blue-900"> {medico.AreadeAtuacao}</p>
                      </div>
                      <Rating name="simple-controlled" value={medico.mediaAvaliacoes} readOnly={readOnlyMode}/>
                    </div>
                  ))}

                  {logged && 
                  <>
                   <AgendamentoConsulta 
                  EspecialidadeMedica={especialidade}
                  titleButon={nameProfissional ? `Agendar com ${nameProfissional}` : 'Agendar consulta'}
                  DoencaAutoComplete={selectedDoenca}
                  SlugRoute={ medicoSlug }
                  Horarios={Horarios}
                  idMedico={idMedico}
                  NomeMedico={nameProfissional ? nameProfissional : ''}
                  ValorConsulta={valorConsulta}
                  FotoMedico={fotoMedico}
                  avaliacoes={avaliacoesDoctor}
                  onClose={() => setLogged(false)}
                  />
                  </>
                }
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {endRegister &&
      <>
       <EndRegisterPatient
       />
      </>
      }

      {registerEndOk && 
      <>
      <AgendamentoConsulta
        EspecialidadeMedica={especialidade}
        titleButon={nameProfissional ? `Agendar com ${nameProfissional}` : 'Agendar consulta'}
        DoencaAutoComplete={selectedDoenca}
        SlugRoute={medicoSlug}
        Horarios={Horarios}
        idMedico={idMedico}
        NomeMedico={nameProfissional ? nameProfissional : ''}
        ValorConsulta={valorConsulta}
        FotoMedico={fotoMedico}
        avaliacoes={avaliacoesDoctor}
        onClose={() => setLogged(false)}
      />
      </>
      }

      {InitialContant && 
       <ComponenteAudio
         
       />
      }
      {blood &&
        <PopUpBlood/>
      }
      <div className="flex items-end justify-end pr-3 pb-4">
        <Image src={Logo} width={30} height={30} alt="Logo Interconsulta" className="animate-spin-slow"/>
      </div>
    </>
  );
};

export default ContentPaciente;
