'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupsIcon from '@mui/icons-material/Groups';
import IconAgenda from '../public/Agenda.png'
import Logo from '../public/logo.png'
/////////////////////////////////////////////////////////////
import Aguardando2 from '../public/Confirmada.png'
import Aguardando from '../public/Aguardando.svg'
import Confirmado2 from '../public/Confirmado2.png'
import Cancelada from '../public/Rejeitada.png'
////////////////////////////////////////////////////////////
import IconNull from '../public/IconNull.png'
////////////////////////////////////////////////////////////
import secureLocalStorage from 'react-secure-storage'
import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { NotPaciente } from '../partials/NotPaciente.jsx'
import { PopUpUnidade } from './AgendaUnidade.js'
import { CasosClinico } from '../partials/popUpCasoClinico'
import { Checkbox } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import StartIcon from '@mui/icons-material/Start'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PopUpAviso } from '../partials/popUpAviso'
///////////////////////////////////////////////////////////
import { NotDateConsulta } from '../partials/NotConsulta'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { saveAs } from 'file-saver'
import { config } from '../config.js'

import { useHorariosDoctor } from '../context/context'
import PopUpMedicoHoras from '../partials/PopUpHorasMedico'
import { useBlood } from "../context/context.js"
import { PopUpBlood } from "../partials/PopUpBlood"

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import { PatientsDoctor } from './PatientsDoctor'
import { PopupCancelPaciente } from '../partials/PopUpCancelPaciente'

export const MainAgenda = () => {

  const[keyConsulta, setKeyConsulta] = useState('')
  const[okMedico, setOkMedico ] = useState(false)
  const[okPaciente, setOkPaciente] = useState(false)
  const[okUnidade, setOkUnidade] = useState(false)
  const[nomeMedico, setNomeMedico] = useState(null)
  const[idCasoPaciente, setidCasoPaciente] = useState([])
  const[idCasoPaciente2, setidCasoPaciente2] = useState([])
  const[CPFPaciente, setCPFPaciente] = useState([])
  const[CPFPaciente2, setCPFPaciente2] = useState([])
  const[NomePacientePublico, setNomePacientePublico] = useState([])
  const[Solicitante, setSolicitante] = useState([])
  const[Data, setData] = useState([])
  const[Inicio, setInicio] = useState([])
  const[Fim, setFim] = useState([])
  const[StatusPaciente, setStatusPaciente] = useState(null)
  const[StatusMedico, setStatusMedico] = useState(null)
  const[StatusUnidade, setStatusUnidade] = useState(null)
  const[idCasoUnidade, setIdCasoUnidade] =  useState([])
  const[idCasoUnidade2, setIdCasoUnidade2] =  useState([])
  const[casoClinicoClicked, setCasoClinicoClicked] = useState([])
  const[idMedico, setIDMedico] = useState('')
  const[doctorUnidade, setDoctorUnidade] = useState(null)

  const[disablednotArrObject, setDisableArrayNotObjetcts] = useState(false)
  const[disableArrayObject, setDisableArrayObject] = useState(false)
  const[selectedSolicitante, setSelectedSolicitante] = useState(null)
  const[avisoMedico, setAvisoMedico] = useState(false)

  const[notConsulta, setNotConsulta] = useState(false)
  const[tempoFaltandoConsulta, setTempoFaltandoConsulta] = useState(false)

  const[dataPacienteParticular, setDataPacienteParticular] = useState('')
  const[inicioPacienteParticular, setInicioPacienteParticular] = useState('')
  const[fimPacienteParticular, setFimPacienteParticular] = useState('')
  const[cancelPaciente, setCancelPaciente] = useState(false)

  const [nomePaciente, setNomePaciente] = useState('')
  const [nomeMédico, setNomeMédicoPaciente] = useState('')
  const [dataPaciente, setDataPaciente] = useState('')
  const [inicioPaciente, setInicioPaciente] = useState('')
  const [fimPaciente, setFimPaciente] = useState('')
  const [idConsultaPaciente, setidConsultaPaciente] = useState('')
  const [idHorarioConsultaPaciente, setidHorarioConsultaPaciente] = useState('')
  const [horarioSelecionadoPaciente, setidHorarioSelecionadoPaciente] = useState('')

  const { horariosDoctor } = useHorariosDoctor()
  const { blood } = useBlood()

  const[setidLink, setIdLink] = useState('')
  const [value, setValue] = useState('1')

  const [checkedIndex, setCheckedIndex] = useState(null)

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const token = secureLocalStorage.getItem('token')

  const Router = useRouter()

  const queryClient = useQueryClient()


  useEffect(() => {
    
  },[casoClinicoClicked, idCasoPaciente2, idCasoUnidade2, CPFPaciente2, idMedico])
  

  const NomeMedicoLocal = secureLocalStorage.getItem('NomeMedico')
  const NomeMedico = NomeMedicoLocal || ''
  const NomePacienteLocal = secureLocalStorage.getItem('NomePaciente')
  const NomeUnidade = secureLocalStorage.getItem('NomeUnidade')
  const TypeDoctor = secureLocalStorage.getItem('TypeDoctor')
 
  const DeleteCasoClinico = useMutation(
    async (body) => {
      try {
        const response = await axios.delete(`${config.apiBaseUrl}/api/delete-caso-clinico`, { data: body });
        return response.data; 
      } catch (error) {
        console.error('Error during delete mutation:', error);
        throw error;
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('Consultas');
      },
    }
  )

  const UpdateConsulta = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/update-consulta`, valueRequest)
    return response.data
  },
  {
    onSettled: () => {  
      queryClient.invalidateQueries('Consultas');
    },
  })


  const GenerateLink = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/generate-link`, valueRequest)
    return response.data
  })

  const getLaudo = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-laudo`, valueRequest, {
      responseType: 'json',
    });
  
    return response.data;
  }, {
    onSuccess: (data) => {
      const { pdfBase64, NomePaciente, Data } = data
  
      const pdfBuffer = Buffer.from(pdfBase64, 'base64')
  
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
  
      const filename = `${NomePaciente}/${Data}.pdf`

      saveAs(blob, filename);
    },
  });

  const RequestGetConsultas = async () => {
    try{
      const request = await axios.get(`${config.apiBaseUrl}/api/get-consultas/${id}`)
      return request.data
    }catch(e){
      throw new Error('Error Fetching Data')
    }
  }

  const queryKey = ['Consultas', keyConsulta];
  const { data, isFetching, isError, isSuccess } = useQuery(
    queryKey, 
    () => RequestGetConsultas(keyConsulta),
  )

  const HandleConfirmaçao = (NomeMedico, CPFPaciente, idCasoPaciente, Status, Data, Inicio, Fim) => {
     if(NomeMedicoLocal !== null){
       setOkMedico(true)
       setCPFPaciente(CPFPaciente)
       setidCasoPaciente(idCasoPaciente)
     }else if(NomePacienteLocal !== null){
         setNomeMedico(NomeMedico)
         setStatusPaciente(Status)
         setidCasoPaciente(idCasoPaciente)
         setOkPaciente(true)
     }else if(NomeUnidade !== null){
        setOkUnidade(true)
        setStatusUnidade(Status)
        setNomeMedico(NomeMedico)
     }
  }

  const AvisoMédico = secureLocalStorage.getItem('AvisoMédico')
  const HandleClickCheckBox = async (idCasoClinico, idCasoClinicoUnidade,CPFPaciente, event, row, NomePacientePublico, inicio, fim, Solicitante, Data, index) => {

  
    if (event.target.checked) {
      // Checkbox marcado
      setCasoClinicoClicked((prev) => [...prev, idCasoClinico]);
      setidCasoPaciente2((prev) => [...prev, idCasoClinico]);
      setIdCasoUnidade2((prev) => [...prev, idCasoClinicoUnidade]);
      setCPFPaciente2((prev) => [...prev, CPFPaciente]);
      setNomePacientePublico((prev) => [...prev, NomePacientePublico])
      setSolicitante((prev) => [...prev, Solicitante])
      setData((prev) => [...prev, Data])
      setInicio((prev) => [...prev, inicio])
      setFim((prev) => [...prev, fim])
      setIDMedico((prev) => [...prev, id])

      // Verifica se row.Casos é um array de objetos
      if (Array.isArray(row.Casos) && row.Casos.length > 0) {
        // Se é um array de objetos, desativa outros checkboxes de arrays de objetos
        setDisableArrayNotObjetcts(true)
        setSelectedSolicitante(Solicitante) 

        if (!AvisoMédico) {
          setAvisoMedico(true);
          secureLocalStorage.setItem('AvisoMédico', 'true');
      }
        
      }
  
      if (!Array.isArray(row.Casos) || (Array.isArray(row.Casos) && row.Casos.length === 0)) {
        setDisableArrayObject(true)
      }

      setCheckedIndex(index);
    } else {
      // Checkbox desmarcado
      setCasoClinicoClicked((prev) => prev.filter((clickedId) => clickedId !== idCasoClinico));
      setidCasoPaciente2((prev) => prev.filter((idPaciente) => idPaciente !== idCasoClinico));
      setIdCasoUnidade2((prev) => prev.filter((idCasoClinicoUnidadeSaude) => idCasoClinicoUnidadeSaude[0] !== idCasoClinicoUnidade[0]))
      setCPFPaciente2((prev) => prev.filter((CPFP) => CPFP[0] !== CPFPaciente[0]))
      setNomePacientePublico((prev) => prev.filter((nome) => nome[0] !== NomePacientePublico[0]))
      setSolicitante((prev) => prev.filter((solicitante) => solicitante !== Solicitante))
      setIDMedico((prev) => prev.filter((IDM) => IDM !== id))
      setData((prev) => prev.filter((data) => data !== Data))
      setInicio((prev) => prev.filter((inicio) => inicio !== inicio))
      setFim((prev) => prev.filter((fim) => fim !== fim))

      setCheckedIndex(null);

      const updatedCasoClinicoClicked =  casoClinicoClicked.filter((clickedId) => clickedId !== idCasoClinico);
  
      const atLeastOneChecked = updatedCasoClinicoClicked.length > 0;

      // Verifica se existem pacientes públicos selecionados
      const PacientePublico = atLeastOneChecked &&
        (Array.isArray(row.Casos) && row.Casos.length > 0)
    
    
      // Verifica se existem pacientes particulares selecionados
      const PacienteParticular = atLeastOneChecked &&
        (!Array.isArray(row.Casos) || (Array.isArray(row.Casos) && row.Casos.length === 0));
 
      setDisableArrayNotObjetcts(PacientePublico) // Paciente Publico
      setDisableArrayObject(PacienteParticular) // Paciente Particular

      setSelectedSolicitante(null)
    }
  }

  const DeleteConsulta = async (idCasoClinico, idCasoClinicoUnidade, CPFPaciente, Solicitante, Data,Inicio,Fim, idHorario, HorarioSelecionado) => {
      if(idCasoClinicoUnidade.length > 0){ // Paciente Publico
         const body = {
          IdentificadorCaso: idCasoClinicoUnidade,
          CPFPaciente: CPFPaciente,
          Solicitante: Solicitante,
          idMedico: id,
          status: `Cancelada por ${NomeMedico}`
         }
         DeleteCasoClinico.mutateAsync(body)
      }else{ // Paciente Particular
        const body = {
          idCasoClinico: idCasoClinico,
          status: `Cancelada por ${NomeMedico}`,
          idMedico: id,
          Data: Data,
          Inicio: Inicio, 
          Fim: Fim,
          idHorario: idHorario,
          HorarioSelecionado: HorarioSelecionado,
         }
         DeleteCasoClinico.mutateAsync(body)
      }
  }

  const DeleteConsultaPacienteParticular = async (idConsulta, Solicitante, Solicitado, Data, Inicio, Fim, idHorario, HorarioSelecionado) => {
    try{
      //const body = {
        //id: idConsulta,
        //Solicitante: Solicitante,
        //idPaciente: id,
        //Data: Data,
        //Inicio: Inicio,
        //Fim: Fim,
        //idHorario: idHorario,
        //HorarioSelecionado: HorarioSelecionado,
       //}
       //await DeleteCasoClinicoPacienteParticular.mutateAsync(body)
       setNomePaciente(Solicitante)
       setNomeMédicoPaciente(Solicitado)
       setDataPaciente(Data)
       setInicioPaciente(Inicio)
       setFimPaciente(Fim)
       setidConsultaPaciente(idConsulta)
       setidHorarioConsultaPaciente(idHorario)
       setidHorarioSelecionadoPaciente(HorarioSelecionado)
       setCancelPaciente(true)
    }catch(e){
      throw new Error('Erro para excluir o Caso Clinico do Paciente Particular', e.message)
    }
  }

  const ConfirmationConsultas = async () => {

      if(idCasoUnidade2[0].length > 0){
        try{
           const body = {
             id: idCasoUnidade2,
             status: `Confirmada por ${NomeMedico}`,
             idMedico: id,
             CPFPacientePublico: CPFPaciente2,
             NomePacientePublico: NomePacientePublico,
             Solicitante: Solicitante,
             Data: Data,
             Inicio: Inicio,
             Fim: Fim,
           }
           await UpdateConsulta.mutateAsync(body)
           setCasoClinicoClicked([])
           setidCasoPaciente2([])
           setIdCasoUnidade2([])
           setCPFPaciente2([])
           setIDMedico('')
           setNomePacientePublico('')
           setSolicitante('')
           setData('')
           setInicio('')
           setFim('')
           setSelectedSolicitante(null)
           setDisableArrayNotObjetcts(false)
  
        }catch(e){
          throw new Error('Fetching Data Error', e)
        }
      }else{
        try{
          const body = {
            Data: Data,
            Inicio: Inicio,
            Fim: Fim,
            idMedico: id,
            idPacienteParticular: idCasoPaciente2,
            status: `Confirmada por ${NomeMedico}`
           }
          await UpdateConsulta.mutateAsync(body)
          setCheckedIndex(null);
          setCasoClinicoClicked([])
          setIdLink(idCasoPaciente2)
          secureLocalStorage.setItem('ConsultaPacienteParticular', idCasoPaciente2)
          setidCasoPaciente2([])
          setIdCasoUnidade2([])
          setCPFPaciente2([])
          setNomePacientePublico('')
          setSolicitante('')
          setIDMedico('')
          setData('')
          setInicio('')
          setFim('')
          setDisableArrayObject(false)

         }catch(e){
           throw new Error('Error Fetching Data', e)
         }
      }
}

    const handleChange = (event, newValue) => {
      setValue(newValue);
    }

const HandleConsulta = async (id) => {
  try {

     const body = {
        IdentificadorConsultaParticular: id,
      };
       const data = await GenerateLink.mutateAsync(body)
       console.log(data)
       
       if(data.message){
        Router.push(data.message)
       }
        
       if(data.TempoFaltando === 'Consulta Expirada'){
          setTempoFaltandoConsulta(data.TempoFaltando)
          setNotConsulta(true)
       }else{
        if (!isNaN(Number(data.TempoFaltando))) {
          setTempoFaltandoConsulta(data.TempoFaltando)
          setNotConsulta(true)
        }
       }
       
  } catch (error) {
    console.error('Error generating link:', error);
  }
}

  const handleLaudo = async (idConsulta) => {

    const body = {
        id: id,
       IdentificadorConsulta: idConsulta
    }
    await getLaudo.mutateAsync(body)
  }


  return(
    <>
      {isFetching ?
        <div className='flex-1 flex justify-center items-center'>
          <Image src={Logo} alt="Logo Interconsulta" width={100} height={100} className='animate-pulse'/>
        </div>
       : 
       <>
       <div className="flex-1 flex justify-center items-center flex-col w-full p-5">
        {id ? 
            <div className='w-10/12 flex flex-col gap-10 justify-center'>
        
            <div className="flex flex-col gap-8">
     
             <div className='flex gap-5 sm:flex sm:justify-center sm:items-center md:justify-center md:items-center'>
               <Image src={Logo} height={40} width={40} alt="Logo Interconsulta" className='animate-spin-slow'/>
               <h1 className='font-bold text-blue-900 text-3xl'> Consultas </h1>
             </div>
     
               <div className='flex gap-32 w-full justify-center items-center sm:gap-10 sm:flex-wrap md:gap-16 md:flex-wrap lg:flex-wrap lg:gap-10'>
     
                 <div className="flex gap-3">
     
                   <div>
                     <EventNoteIcon color="primary" fontSize='large'/>
                   </div>
     
                  <div className="flex flex-col justify-center items-center">
                   <h2 className='font-bold text-blue-900'> {data && data.countAtendidas}</h2>
                   <h2 className='font-bold text-blue-500'> Atendidas</h2>
                  </div>
     
                 </div>
     
                 <div className="flex gap-3">
     
                 <div>
                 <EventAvailableIcon color="success" fontSize='large'/>
                 </div>
     
                 <div className="flex flex-col justify-center items-center">
                   <h2 className='font-bold text-blue-900'> {data && data.countConfirmadas}</h2>
                   <h2 className='font-bold text-blue-500'> Confirmadas</h2>
                 </div>
     
                 </div>
                 
                 <div className="flex gap-3">
     
                 <div>
                   <DateRangeIcon color="warning" fontSize='large'/>
                 </div>
     
                 <div className="flex flex-col justify-center items-center">
                   <h2 className='font-bold text-blue-900'> {data && data.countAguardando}</h2>
                   <h2 className='font-bold text-blue-500'> Aguardadas</h2>
                 </div>
     
                 </div>
     
                 {NomeMedico || NomeUnidade ?  
                 null
                 : 
                 <>
                 <div className="flex gap-3">
                 <div>
                  <EventBusyIcon color="error" fontSize='large'/>
                 </div>
     
                 <div className="flex flex-col justify-center items-center">
                 <h2 className='font-bold text-blue-900'> {data && data.countCanceladas}</h2>
                 <h2 className='font-bold text-blue-500'> Canceladas</h2>
                 </div>
     
                 </div>
                 </> 
                 }
               </div>
     
           </div>
     
           <div className='flex flex-col gap-5 w-full'>
             
             <div className='flex gap-5 justify-start items-start'>
             <div>
             <Image src={IconAgenda} width={80} height={80} alt="Icon Agenda"/>
             </div>
       
             <div className='sm:flex sm:justify-center sm:items-center md:flex md:justify-center md:items-center'>
               <h2 className='font-bold text-blue-900 text-2xl sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap'> Sua Agenda Médica </h2>
             </div>
             </div>  
             {
             (disablednotArrObject || disableArrayObject) && casoClinicoClicked.length > 0 && (
               <>
                 <div className='flex justify-center items-center gap-3'>
                   <FingerprintIcon color="primary" fontSize='large'/>
                   <h1 className='text-blue-600 font-bold text-xl'>
                     Tipo de Paciente: {disablednotArrObject ? 'Público' : 'Particular'}
                   </h1>
                 </div>
     
                 <button className="bg-blue-600 p-2 rounded-full" onClick={ConfirmationConsultas}>
                   <p className="font-bold text-white">
                     {casoClinicoClicked.length > 1
                       ? `Confirmar consultas com ${casoClinicoClicked.length} Pacientes ${disablednotArrObject ? 'Públicos' : 'Particulares'}`
                       : `Confirmar Consulta com ${casoClinicoClicked.length} Paciente ${disablednotArrObject ? 'Público' : 'Particular'}` 
                     }
                   </p>
                 </button>
               </>
             )
           }
        
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="flex justify-center">
                <TabList onChange={handleChange} aria-label="Tab-list">

                <Tab label="Agenda" value="1" />
                  {NomeMedico ?  
                  <Tab label="Seus Pacientes" value="2" /> 
                  : ''}
                </TabList>
              </Box>
              <TabPanel value="1" >
              <div className="bg-blue-50 p-2 min-h-[200px] rounded-lg w-full  overflow-x-auto">
               <table className="min-w-full shadow-2xl">
                 <thead className='w-full'>
                   <tr>
                     {NomeUnidade ? null 
                     :
                     <>
                    <th className="border-b bg-white text-black py-2 px-4 font-normal">
                     <div className="flex items-center justify-center">
                       <div className="bg-blue-500 rounded-full h-3 w-3 mr-2"></div>
                       Data
                     </div>
                   </th>
                     <th className="border-b bg-white text-black py-2 px-4 font-normal flex justify-center items-center">
                       <div className='flex items-center justify-center'>
                         <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                         { NomePacienteLocal ? 'Horario': 'Inicio' }
                       </div>
                     </th>
                     {NomePacienteLocal ? null : 
                      <th className="border-b bg-white text-black py-2 px-4 font-normal">
                      <div className='flex items-center justify-center'>
                        <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                         Fim
                      </div>
                     </th>
                     }
                     </>
                     }
                     {NomePacienteLocal ? null 
                     :
                     <th className="border-b bg-white text-black py-2 px-4 font-normal">
                     <div className='flex items-center justify-center'>
                       <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                        Solicitante
                     </div>
                    </th> 
                     }
                     {NomeMedico ? null :
                       <th className="border-b bg-white text-black py-2 px-4 font-normal">
                       <div className='flex items-center justify-center'>
                         <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                         {NomeUnidade ? 'Nome Paciente' : 'Solicitado'} 
                       </div>
                      </th>
                     }
                    {TypeDoctor === 'Atendimento Público' ?  null :
                     <th className="border-b bg-white text-black py-2 px-4 font-normal">
                      <div className='flex items-center justify-center'>
                      <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                        {NomePacienteLocal ? 'Status':
                        <>  
                         <p className='whitespace-nowrap'> Linha da vida </p>
                        </>
                        }
                      </div>
                      </th>
                     }
                      {TypeDoctor !== 'Atendimento Público' && !NomePacienteLocal ? 
                       <th className="border-b bg-white text-black py-2 px-4 font-normal">
                         <div className='flex items-center'>
                           <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                           Confirmar
                          </div>
                        </th>
                       : null}
     
                     {TypeDoctor !== 'Atendimento Público' && !NomePacienteLocal ? 
                       <th className="border-b bg-white text-black py-2 px-4 font-normal">
                         <div className='flex items-center'>
                           <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                           Cancelar
                          </div>
                        </th>
                       : null}
                       
                     {NomePacienteLocal ? 
                      <th className="border-b bg-white text-black py-2 px-4 font-normal">
                         <div className='flex items-center justify-center'>
                           <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                           Cancelar Consulta
                          </div>
                        </th>
                      : null
                      }

                    {NomeMedico ? 
                      <th className="border-b bg-white text-black py-2 px-4 font-normal">
                      <div className='flex items-center justify-center'>
                        <div className="bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></div>
                        Consulta
                       </div>
                     </th>
                    :
                    null}
                   </tr>
                 </thead>
    
                 <tbody className='bg-white'>
                 {data && data.Consultas ? (
                   data.Consultas.map((row, index) => (
                     <tr key={index}>
                       <td className="border-b py-2 px-4 text-center">{row.Data}</td>
                       <td className="border-b py-2 px-4 text-center">
                        {row.Inicio}
                        </td>
                       <td className="border-b py-2 px-4 text-center whitespace-nowrap">{row.Solicitado}</td>
                       {row.Status && (
                       <td className='border-b py-2 px-4 text-center whitespace-nowrap'>
                         <div className='flex justify-center items-center cursor-pointer'
                          onClick={() => HandleConfirmaçao(
                          row.Solicitado,
                          row.Solicitante, 
                          row._id, 
                          row.Status,
                          )}>

                      {row.Status.includes('Aguardando') ?
                      <div className="flex justify-center items-center">
                        <Image src={Aguardando} alt='Atendida' height={20} width={20}/> 
                      </div> : null}


                      {row.Status.includes('Cancelada') ?
                      <div className="flex justify-center items-center">
                       <CloseIcon color="error" className='cursor-pointer'/>  
                      </div> : null}

                      {row.Status.includes('Confirmada') ?
                      <div className="flex justify-center items-center">
                        <Image src={Confirmado2} alt='Atendida' height={20} width={20}/> 
                      </div> : null}

                      {row.Status.includes('Atendida') ?
                      <div className="flex justify-center items-center">
                        <Image src={Logo} alt='Atendida' height={37} width={37}/> 
                      </div> : null}
                          
                        </div>
                       </td>
                     )}
     
                   <td className='border-b py-2 px-4 text-center cursor-pointer'>
                     <div className='flex justify-center items-center'>
                      {row.Status.includes('Atendida') ?
                      '' :
                      row.Status.includes('Cancelada') ? ''
                      :
                       <CloseIcon color="error" className='cursor-pointer' onClick={() => DeleteConsultaPacienteParticular(row._id, row.Solicitante, row.Solicitado, row.Data, row.Inicio, row.Fim, row.idHorario, row.HorarioSelecionado)}/>}
                     </div>      
                   </td>
                     </tr>
                   ))
                 ) : 
                 data && data.ConsultasGerais ?
                 data.ConsultasGerais.map((row, index) => (
                   <tr key={index}>
                    {() =>setDoctorUnidade(true)}
                     <td className="border-b py-2 px-4 text-center">{row.Data}</td>
                     <td className="border-b py-2 px-4 text-center">{row.Inicio}</td>
                     <td className='border-b py-2 px-4 text-center'>{row.Fim}</td>
                     <td className="border-b py-2 px-4 text-center whitespace-nowrap">{row.Solicitante}</td>
                     {row.Status && (
                      TypeDoctor === 'Atendimento Público' ? null : 
                     <td className='border-b py-2 px-4 text-center whitespace-nowrap'>
                       <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                         const casosIdentificadores = Array.isArray(row.Casos)
                           ? row.Casos.map(data => data.IdentificadorConsulta)
                           : []

                        const CPFPaciente = row.CPFPaciente

                         HandleConfirmaçao(row.Solicitado, CPFPaciente, row._id, row.Status, casosIdentificadores)
                       }}>
                         <Image
                           src={Aguardando2}
                           width={20}
                           height={20}
                           alt="Logo Olho Aguardando"
                         />
                       </div>
                     </td>
                   )}
                    
                    {TypeDoctor === 'Atendimento Público' ? null : 
                     <td className="border-b py-2 px-4 text-center whitespace-nowrap">
                     {
                     row.Status.includes('Confirmada') ? 
                     <div className='flex justify-center items-center'>
                       <Image src={Confirmado2} alt='Confirmado' height={20} width={20}/> 
                     </div>
                     :
                     row.Status.includes('Aguardando') ? 
                     <Checkbox
                     checked={casoClinicoClicked.includes(row._id) && checkedIndex === index}
                     onChange={(event) => {
                       const IdentificadorCasoPublico = Array.isArray(row.Casos)
                         ? row.Casos.map(data => data.IdentificadorConsulta)
                         : [];
                       
                       const CPFPaciente2 = Array.isArray(row.Casos)
                         ? row.Casos.map(data => data.CPF)
                         : []
 
                       const NomePacientePublico = Array.isArray(row.Casos) 
                       ? row.Casos.map((data) => data.NomePaciente) 
                       : []
 
                   
                       HandleClickCheckBox(row._id, IdentificadorCasoPublico, CPFPaciente2, event,row, NomePacientePublico, row.Inicio, row.Fim, row.Solicitante, row.Data, index)
                     }}
                     disabled={
                       (disablednotArrObject && (!Array.isArray(row.Casos) || (Array.isArray(row.Casos) && row.Casos.length === 0))) ||
                       (disableArrayObject && (Array.isArray(row.Casos) && row.Casos.length > 0)) ||
                       (selectedSolicitante !== null && selectedSolicitante !== row.Solicitante) ||
                       checkedIndex !== null && checkedIndex !== index 
                       
                     }
                   />
                     :
                     row.Status.includes('Atendida') ?
                       <div className="flex justify-center items-center">
                         <Image src={Logo} alt='Atendida' height={37} width={37}/> 
                       </div>
                     :
                     row.Status.includes('Aceita') ?
                      <div className="flex justify-center items-center">
                        <Image src={Cancelada} alt="Aceita" height={20}  width={20}/>
                      </div>
                     : null
                      }
                 </td>
                }
                
                {TypeDoctor === 'Atendimento Público' ? null :
                    row.Status.includes('Atendida') ? 
                    <td className='border-b py-2 px-4 text-center cursor-pointer'>
                   <div className="flex justify-center items-center">
                     
                   </div>
                   </td>
                  :
                  <td className="border-b py-2 px-4 text-center whitespace-nowrap" 
                 
                  onClick={() => {
                   const IdentificadorConsulta = Array.isArray(row.Casos)
                   ? row.Casos.map(data => data.IdentificadorConsulta)
                   : [];
                 
                   const CPFPaciente3 = Array.isArray(row.Casos)
                   ? row.Casos.map(data => data.CPF)
                   : []
                  
                    DeleteConsulta(row._id, IdentificadorConsulta, CPFPaciente3, row.Solicitante, row.Data, row.Inicio, row.Fim, row.idHorario, row.HorarioSelecionado)
                  }}>
                    <CloseIcon color="error" className='cursor-pointer'/>
                  </td>
                }
                 
                 <td className='border-b py-2 px-4 text-center whitespace-nowrap'>
                 {TypeDoctor === 'Atendimento Público' ? 
                  row.Status.includes('Aguardando') ? 'Aguardando' :

                  row.Status.includes('Confirmada') ?
                  <div className='flex justify-center items-center gap-3'>
                      <Image src={Logo} alt='Atendida' height={37} width={37}/> 
                      <p> Aceita </p>
                  </div>
                   :
                  row.Status.includes('Cancelada') && 

                  <div className='flex justify-center items-center gap-3'>
                    <CloseIcon color="error" fontSize='large'/> 
                    <p> Cancelada </p>
                  </div>
                  
                 :  
                  row.Status.includes('Confirmada') &&
                  <GroupsIcon 
                  color="primary"
                  onClick={() => HandleConsulta(row._id)}
                  disabled={GenerateLink.isLoading}
                  className='cursor-pointer'
                  />
                  } 
                 </td>               

               </tr>
                 )) :
                 data && data.ConsultaUnidade ? 
                 data.ConsultaUnidade.map((row, index) => (
                   <tr key={index}>
                     <td className="border-b py-2 px-4 text-center whitespace-nowrap">{row.Solicitante}</td>
                     <td className="border-b py-2 px-4 text-center whitespace-nowrap">
                       {row.Casos.map((data) => data.NomePaciente)}
                     </td>
                     <td className='border-b py-2 px-4 text-center whitespace-nowrap'>{row.Status}</td>
                     {row.Status && (
                     <td className='border-b py-2 px-4 text-center whitespace-nowrap'>
                       <div className='flex justify-center items-center cursor-pointer pt-3' onClick={() => HandleConfirmaçao(row.Solicitado, row.Solicitante, row._id, row.Status)}>
                         <Image
                           src={
                             row.Status.includes('Confirmada') ? Confirmado2 :
                             row.Status.includes('Cancelada') ? Cancelada :
                             row.Status.includes('Aguardando') ? Aguardando :
                             row.Status.includes('Atendida') ? Logo :
                             null
                           }
                           width={20}
                           height={20}
                           alt="Logo Status"
                         />
                       </div>
                     </td>
                   )}
                   </tr>
                 )) :
                 null }
       
                   {okMedico && <CasosClinico
                   onClose={() => setOkMedico(false)}
                   CasoClinicoPaciente={idCasoPaciente}
                   CasoClinicoUnidade={idCasoUnidade}
                   Status={StatusMedico}
                   CPF={CPFPaciente}
                   />}
                   
                  {okPaciente && <NotPaciente
                   NomeMedico={nomeMedico}
                   onClose={() => setOkPaciente(false)}
                   Status={StatusPaciente}
                   dataConsulta={dataPacienteParticular}
                   inicioConsulta={inicioPacienteParticular}
                   fimConsulta={fimPacienteParticular}
                   idConsulta={idCasoPaciente}
                   />
                   }
                  {okUnidade && <PopUpUnidade
                  Status={StatusUnidade}  
                  NomeMedico={nomeMedico}
                  onClose={() => setOkUnidade(false)}/>}

                  {selectedSolicitante !== null && AvisoMédico === 'true' &&
                    <PopUpAviso
                      NomeMedico={NomeMedicoLocal}
                      Unidade={selectedSolicitante}
                    />
                  }
                  {notConsulta &&
                    <NotDateConsulta
                    nomeMedico={NomeMedicoLocal}
                    TempoFaltando={tempoFaltandoConsulta}
                    onClose={() => setNotConsulta(false)}
                    />
                  }
                 </tbody>
               </table>
             </div>
          
              </TabPanel>
              {NomeMedico ?
              <TabPanel value="2">
                <PatientsDoctor/>
              </TabPanel> 
              : 
              null
              }
            </TabContext>
         </Box> 
          
             
             </div>
     
           </div> :
        <>
        <div className='flex justify-center items-center flex-col gap-5 w-full sm:gap-8'>
          <div className='flex gap-5 sm:flex-col'>
            <div className=' sm:flex sm:justify-center sm:items-center'>
              <Image src={IconNull} width={50} height={50} alt="Logo IconNull" className='sm:w-12 sm:h-12'/>
            </div>
            <div className='flex justify-center items-center'>
              <h1 className='text-2xl font-bold text-black sm:text-xl sm:text-center md:text-center lg:text-center'> Ops infelizmente voce não esta Logado, logue agora para poder ver suas Consultas!</h1>
            </div>
          </div>
          <Link href='/welcome' className='w-full flex justify-center items-center'>
          <button className='p-2 bg-red-500 rounded-full w-1/2 text-white font-bold sm:w-full animate-pulse cursor-pointer'> 
          Fazer Login 
          </button>
          </Link>
        </div>
        </>
      } 
       </div>
       </> 
       }

       {cancelPaciente && 
       <PopupCancelPaciente
        nomePaciente={nomePaciente}
        nomeMédico={nomeMédico}
        data={dataPaciente}
        inicio={inicioPaciente} 
        fim={fimPaciente}
        idConsulta={idConsultaPaciente}
        idHorario={idHorarioConsultaPaciente}
        HorarioSelecionado={horarioSelecionadoPaciente}
        onClose={() => setCancelPaciente(false)}
       />
       }

       {horariosDoctor && 
          <PopUpMedicoHoras/>
       }

      {blood &&
        <PopUpBlood/>
      }
   
    </>
  )
}