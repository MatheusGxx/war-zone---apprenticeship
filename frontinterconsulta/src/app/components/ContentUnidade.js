'use client'
import { useState, useRef, useEffect } from 'react';
import { Snackbar , Alert, TextField, Autocomplete, CircularProgress, Typography } from "@mui/material"
import { useMutation } from '@tanstack/react-query'
import { MedicoCarousel } from '../partials/CarroselMédico.js'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { EspecialidadesUnidades } from '../partials/EspecialidadesUnidade'
import AttachFileIcon from '@mui/icons-material/AttachFile'

import axios from 'axios'
import Image from "next/image";
import Logo from '../public/logo.png'
import DeleteIcon from '@mui/icons-material/Delete'
import secureLocalStorage from 'react-secure-storage'
import { usePathname } from 'next/navigation.js';
import { parse } from 'date-fns'
import { Api2 } from '../config.js'
import { config } from '../config.js'
import { PacienteFaltando } from '../partials/PacientesFaltando.jsx'
import Link from 'next/link'

const ContentUnidade = () => {
  const[especialidade, setEspecialidade] = useState('')
  const[inicio, setInicio] = useState('')
  const[fim, setFim] = useState('')
  const[InicioMedicos, setInicioMedicos] = useState('')
  const[FimMedicos, setFimMedicos] = useState('')
  const[valorTotal, setValorTotal ] = useState('')
  const[valorConsulta, setValorConsulta ] = useState('')
  const[selectedFile, setSelectedFile] = useState(null)
  const hiddenFileInput = useRef(null)
  const divInfoRef = useRef(null)
  const[visiblePlan, setVisiblePlan] = useState(false)
  const[visibleButton, setVisibileButton] = useState(true)
  const[successData, setSuccessData] = useState([])
  const[horasMedicas, setHorasMedicas] = useState('')
  const[atendimentos, setAtendimentos] = useState('')
  const[medicos, setMedicosDisponiveis] = useState('')
  const[custo, setCusto] = useState('')
  const[consolidado, setConsolidado] = useState('')
  const[objectData, setObjectaData] = useState([])
  const[snackbarOpen, setSnackbarOpen] = useState(false)
  const[snackbarMessage, setSnackbarMessage] = useState("")
  const[on, setOn] = useState(true)
  const[reset, setReset] = useState(false)
  const[agendamentoOn, setAgendamentoOn] = useState(false)
  const[okCasosClinicos, setOkCasosClinicos] = useState(false)
  const[messageUnidade, setMessageUnidade] = useState('')
  const[messageErr, setMessageErr] = useState('')
  const[position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  })
  const[pacienteFaltando, setPacienteSobrando] = useState(null)
  const[onPopup, setOnPopup] = useState(false)
  const[pacientes, setPacientes] = useState(false)
  const[finalDiasAtendimentos,  setFinalDiasAtendimentos] = useState(null)
  const[numeroAtendimentosDias, setNumeroAtendimentosDias] = useState(null)
  const[quantidadeCasosClinicos, setQuantidadeCasosClinicos] = useState(null)
  const[ArrendondamentoDiaFraseFinalNumber, setArrendondamentoDiaFraseFinalNumber] = useState(null)
  const[endMessage, setEndMessage] = useState(false)

  const { vertical, horizontal } = position

  const currencySymbol = 'R$'
  
  const id = secureLocalStorage.getItem('id')

  const NameUnidadeSaude = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false
  
  const OriginalUnidadeUnidade = NameUnidadeSaude ? NameUnidadeSaude : ''

  const NomeMedico = secureLocalStorage.getItem('NomeMedico')
  const NomePaciente = secureLocalStorage.getItem('NomePaciente')

  const token = secureLocalStorage.getItem('token')

  const Route = usePathname()

  const resetStateOnError = () => {
    setVisibileButton(true);
    setVisiblePlan(false)
    setSelectedFile(null)
    setMessageErr('')
    setOkCasosClinicos(false)

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = null
    }
  }

  const CreateRequestMutation = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/process-planilha/${id}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) => {
      const CPFSPacientes = data.map((data) => data.CPF)
      PostConsolidado(CPFSPacientes)
      setMessageUnidade(`${OriginalUnidadeUnidade}, Nós acabamos de informar todos os Pacientes da sua planilha que voce esta procurando médico para eles!`)
    },
    onError: () => {
       resetStateOnError()
    }
  })

  const CreateConsolidado = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/get-consolidado`, valueRequest)
    return response.data
  },{
    onSuccess: (data) => {
      const { 
        Inicio, 
        Fim, 
        SomaAtendimentoDiaFinal, 
        MessageAtendimentosDia, 
        ArrendondamentoDiaFraseFinal, 
        QuantidadeMedicosDisponiveis, 
        FinalDiasAtendimentos, 
        NumeroAtendimentosFinais, 
        QuantidadeCasosClinicos, 
        CustoEstilizado, 
        Consolidado, 
        MedicosDisponiveis
       } = data

      setOkCasosClinicos(false)
      setInicioMedicos(Inicio)
      setFimMedicos(Fim)
      setHorasMedicas(SomaAtendimentoDiaFinal)
      setAtendimentos(MessageAtendimentosDia)
      setArrendondamentoDiaFraseFinalNumber(ArrendondamentoDiaFraseFinal)
      setMedicosDisponiveis(QuantidadeMedicosDisponiveis)
      setFinalDiasAtendimentos(FinalDiasAtendimentos)
      setNumeroAtendimentosDias(NumeroAtendimentosFinais)
      setQuantidadeCasosClinicos(QuantidadeCasosClinicos)
      setCusto(CustoEstilizado)
      setConsolidado(Consolidado)
      setSuccessData(MedicosDisponiveis)
      setOn(false)
      
    },
    onError: (err) => {
      setMessageErr(err.response.data.error)
      setSnackbarMessage(err.response.data.error)
      handleSnackBarOpen()
      resetStateOnError()
      console.error(err.response.data.error)  
    }
  })

  const NotificationConfirmationDoctorAndPatient = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/notification-doctors-and-patients`, valueRequest)
    return response.data
  },{
    onSuccess: () => {
      PostFilaDeEspera()
      setEndMessage(true)
    }
  })

  const RequestFilaDeEspera = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-wait-list`, valueRequest)
    return response.data
  },{
    onSuccess:(data) => {
      const { UltimosPacientesEspera } = data
      const UltimosPacientes = UltimosPacientesEspera.ListDeEspera
      setPacientes(UltimosPacientes)
      setPacienteSobrando(UltimosPacientes.length)
    }
  })
    
  useEffect(() =>{
  secureLocalStorage.getItem('id')
  },[objectData, successData])

  useEffect(() => {
  
    if (
      horasMedicas !== '' &&
      atendimentos !== '' &&
      medicos &&
      consolidado !== ''
    ) {
      divInfoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } 
  
  }, [horasMedicas, atendimentos, medicos, consolidado, on, reset, inicio, fim, pacienteFaltando, visiblePlan, visibleButton, on])
  
  
  const NotificationPatientsAndDoctor = async () =>{
    if(successData && successData.length > 0){
      const CPFPacientes = objectData.map((data) => data.CPF)
      const IDSMedicos = successData.map((data) =>  data._id)

      try{
        await NotificationConfirmationDoctorAndPatient.mutateAsync(
          { CPFPacientes, 
            IDSMedicos, 
            NomeUnidade: OriginalUnidadeUnidade, 
            QuantidadeMedicosDisponiveis: medicos,
            IDUnidade: id,
            Solicitante: OriginalUnidadeUnidade,
            Casos: objectData,
            Status: `${OriginalUnidadeUnidade} Aguardando - Unidade`,
            PacientesQueSuportamos: horasMedicas,
            DataInicioConsolidado: InicioMedicos,
            DataFimConsolidado: FimMedicos,
            NomeUnidade: OriginalUnidadeUnidade
          }
        )
         setAgendamentoOn(true)
      }catch(err){
        console.log(err)
        snackbarMessage('Erro ao Notificar os Médicos')
        handleSnackBarOpen()
      }
      
   }else{
    setSnackbarMessage(`${OriginalUnidadeUnidade} no momento nao temos Médicos o suficiente para notificarmos os seus Pacientes`)
    handleSnackBarOpen()
   }
  }

  const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const fileName = file ? file.name : ''
    setVisiblePlan(() => fileName)
    setVisibileButton(false)  

    setSelectedFile(file);
  }

  const RemoveFileChange = () => {
    hiddenFileInput.current.value = ''
    setSelectedFile(null)
    setVisiblePlan(() => '')
    setVisibileButton(true)
  }

  const handleClick = () => {
    hiddenFileInput.current.click();
  }

  const handleInicioChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = value.replace(regex, '$1/$2/$3')
    setInicio(formattedValue);
  };

  const handleFimChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    const formattedValue = value.replace(regex, '$1/$2/$3')
    setFim(formattedValue);
  }

  const handleValorTotalChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValorTotal(value);
  };

  const handleValorConsultaChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValorConsulta(value);
  }

  const Reset = () => {
    setHorasMedicas('')
    setAtendimentos('')
    setMedicosDisponiveis('')
    setCusto('')
    setConsolidado('')
    setSuccessData([])
    setObjectaData([])
    setOn(true)
    setReset(true)
    setAgendamentoOn(false)
    setVisibileButton(true)
    setPacienteSobrando(null)
    setOnPopup(false)
    setEndMessage(false)
  }

  const PostConsolidado = async (CPFsPacientes) => {
    try{
       await CreateConsolidado.mutateAsync({
        inicio: inicio,
        fim: fim,
        total: valorConsulta,
        consulta: valorConsulta,
        id: id,
        EspecialidadeMedica: especialidade,
        CPFsPacientes: CPFsPacientes
      })
    }catch(err){
      return err
    }

  }
 
  const HandleClickFinal = async () => {
    const formData = new FormData();
    formData.append("EspecialidadeMedica", especialidade)
    formData.append("file", selectedFile)
  
    try {
      const data = await CreateRequestMutation.mutateAsync(formData)
      setObjectaData(data)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.Error) {
        if (Array.isArray(err.response.data.Error)) {
          const numberOfDuplicates = err.response.data.Error.length
          setSnackbarMessage(`Você tem ${numberOfDuplicates} casos clínicos repetidos, favor verifique a sua planilha e a suba de novo`);
        } else {
          setSnackbarMessage(err.response.data.Error)
        }
      } else {
        setSnackbarMessage(err.response.data.error)}
        setMessageErr(err.response.data.error)
        setVisibileButton(true)
        setVisiblePlan(false)
      handleSnackBarOpen();
    }
  };
  
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const HandleClickEnd = () => {
    const DataInicio = parse(`${inicio}`, 'dd/MM/yyyy', new Date())
    const DataFim = parse(`${fim}`, 'dd/MM/yyyy', new Date())
  
    if (especialidade === '' || inicio === '' || fim === '' || selectedFile === null) {
      setSnackbarMessage("Ops, você não preencheu todos os campos Obrigatórios para subir os seus Casos clinicos")
      handleSnackBarOpen()
      resetStateOnError()
    } else if (DataInicio >= DataFim) {
      setSnackbarMessage('Ops Unidade, a Data de Inicio sempre tem que ser inferior a Data Fim');
      handleSnackBarOpen()
      resetStateOnError()
    } else {
      HandleClickFinal();
    }
  }

  const PostFilaDeEspera = async () => {
    try{
      await RequestFilaDeEspera.mutateAsync()
    }catch(err){ 
      return err
    }
  }

  const HandlePopUp = () => {
    setOnPopup(true)
  }

  const HandleOkCasosClinicos = () => {
     setOkCasosClinicos(true)
     setVisiblePlan(false)
     HandleClickEnd()
  }

  return (
    <>
       {token && NameUnidadeSaude ? 
          <div className='flex flex-col gap-5 m-10 sm:flex sm:justify-center sm:items-center md:justify-center w-full'>
          {on === true ?
          <>
          <h1 className="font-bold text-blue-500 text-center text-2xl"> Solicite o seu Agendamento </h1>
  
          <div className="flex flex-col justify-center items-center sm:flex sm:flex-col sm:gap-5 sm:w-full">
              <h1 className='font-semibold text-blue-500 mb-[-2px] mt-2 text-lg'> Especialidade Médica *</h1>
              <Autocomplete
                value={especialidade === '' ? null : especialidade}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setEspecialidade(newValue)
                  }
                }}
                options={EspecialidadesUnidades}
                noOptionsText="Sem resultados"
                renderInput={(params) =>
                   <TextField {...params} 
                   label="Selecione a Especialidade Desejada"
                   variant="standard"/>
                  }
                className=" w-10/12 border-b border-blue-500 sm:w-full"
              />
            </div>
  
            <div className='flex justify-center items-center gap-10 sm:flex-col'>
  
            <div className="flex flex-col gap-2 w-full">
            <h1 className='font-semibold text-blue-500 text-lg whitespace-nowrap'> Data de Início dos Atendimentos *</h1>
            <TextField
              variant="standard"
              label="Selecione a Data de Início"
              InputProps={{
                sx: { borderBottom: "1px solid blue" },
              }}
              type="text"
              required
              onChange={handleInicioChange}
              className="w-full sm:w-full"
              value={inicio}
            />
  
            </div>
  
            <div className='flex flex-col gap-2 w-full'>
            <h1 className='font-semibold text-blue-500 text-lg whitespace-nowrap'> Data do Fim dos Atendimentos *</h1>
            <TextField
                variant="standard"
                label="Selecione a Data de Fim"
                InputProps={{
                  sx: { borderBottom: "1px solid blue" }
              }}
                type="text"
                required
                onChange={handleFimChange}
                className="w-full sm:w-full"
                value={fim}
              />
            </div>
          
            </div>
  
            <input
              type="file"
              className="hidden"
              onChange={(e) =>  handleFileChange(e)}
              ref={hiddenFileInput}
            />
                
             <div className="flex justify-center gap-3 flex-col items-center">
        
             {visibleButton ?
             <>
              <button className="bg-blue-600 rounded-full w-52 h-10 flex gap-2 p-2 justify-center items-center" onClick={handleClick}> 
                  <AttachFileIcon  style={{ color: 'white' }}/>
                  <p className='text-white font-bold text-center'> 
                  Anexar Planilha
                  </p>
                </button>
                <p className='font-bold text-blue-400'> Planilha formato Excel: .xlsx</p>
             </>
                  : ''
              }
            
              {visiblePlan ? 
                <>
                   <div className="flex items-center justify-center">
                  <h1> Nome da Planilha selecionada: <span className="font-bold text-blue-500">{visiblePlan}</span> <DeleteIcon color="primary" onClick={RemoveFileChange} className="cursor-pointer"/> </h1> 
                   </div>
                  </>
             : ''}
             
             
             {visiblePlan &&   
             <button className='bg-blue-600 rounded-full p-2 w-1/3' onClick={HandleOkCasosClinicos}>
              <p className='font-bold text-white'> Analisar Lista </p>
             </button> 
             }       
  
              {okCasosClinicos && messageErr === '' && 
              <div className='flex gap-4 flex-col justify-center items-center'>
                <div className='flex gap-4'>
                <CircularProgress color="primary" size={24}/>
                <h1 className='font-bold text-blue-500 animate-pulse text-center'> Analisando Planilha </h1>
                </div>
              </div>
              }
          </div>
          </>
           : ''}
            
  
          {horasMedicas !== '' && atendimentos !== '' && medicos  && consolidado !== '' && successData !== null ?
            <>
          <div className='flex justify-center items-center flex-col gap-5 w-full' ref={divInfoRef}>
            {endMessage ? 
            <>
            <h1 className='text-center text-2xl font-bold text-blue-500'> Notificações Enviadas com Sucesso! </h1>
             <h1 className='font-normal text-center text-lg'> {NameUnidadeSaude}, sua equipe médica e os pacientes da lista foram notificados e agendados com sucesso.</h1>
            </>
             :
             <div className=' flex justify-center items-center flex-col w-full p-5 gap-5'>
              <h1 className="text-center text-2xl font-bold text-blue-500"> Acabe com as Filas! </h1>
              <h1 className='text-center text-lg leading-8 whitespace-normal'> Você possui <span className='font-bold text-blue-500'> {medicos} </span> {medicos > 1 ? 'médicos' : 'médico'} com horário disponível na Unidade de Saúde 
                <span className='font-bold text-blue-500'> {NameUnidadeSaude} </span> entre os dias <span className='font-bold text-blue-500'> {InicioMedicos}  </span> e  <span className='font-bold text-blue-500'> {FimMedicos} </span>. 
              Com isso, se cada médico fizer em média <span className='font-bold text-blue-500'> {ArrendondamentoDiaFraseFinalNumber} </span> atendimentos por dia, no final de <span className='font-bold text-blue-500'> {finalDiasAtendimentos} </span> {finalDiasAtendimentos > 1 ? 'dias' : 'dia'},
              você poderá atender <span className='font-bold text-blue-500'> {horasMedicas} </span> do total de <span className='font-bold text-blue-500'> {quantidadeCasosClinicos} </span> pacientes que precisam de <span className='font-bold text-blue-500'> {especialidade.replace("UPA01 - ", "")} </span>.
              </h1>
              {CreateRequestMutation.isLoading &&
                    <Image src={Logo} alt="Logo Interconsulta" height={50} width={50} className="animate-pulse"/>
              }
            </div>
            }
  
        {pacienteFaltando > 0 && 
          <> 
          <h1 className='font-normal text-center text-lg'> 
          Abaixo seguem pacientes que não conseguiram horário para que eles sejam colocados em prioridade na próxima lista de agendamento.
          </h1>
          <button className="bg-blue-500 rounded-full p-2 animate-pulse w-1/2 sm:w-full" onClick={HandlePopUp}>
            <p className='font-bold text-white whitespace-nowrap'>  Pacientes Não Agendados </p>
          </button>
          </>
        }
  
      <div className={`flex flex-col gap-5`}>
        {endMessage ? 
        null
        : 
        <button 
        className={`bg-blue-500
          p-2 rounded-full text-white font-bold w-full flex items-center justify-center gap-5 cursor-pointer`}
        onClick={NotificationPatientsAndDoctor}
        disabled={agendamentoOn === true || NotificationConfirmationDoctorAndPatient.isLoading}
      >
        {NotificationConfirmationDoctorAndPatient.isLoading ? (
          <>
          <CircularProgress size={24} color='inherit'/> Notificando a Rede
          </>
        ) : (
          <p className='whitespace-nowrap'>
            {NotificationConfirmationDoctorAndPatient.isSuccess && agendamentoOn
              ? `${OriginalUnidadeUnidade}`
              : 'Agendar Consultas Médicas'}
          </p>
        )}
      </button>
        }

        <button>
          <h2 className='text-red-600 font-bold whitespace-nowrap cursor-pointer' onClick={Reset}>
            {endMessage ? 'Fazer Nova Programação' : 'Refazer Programação'}
          </h2>
        </button>
      </div>
  
        </div>
         </>
            : ''}
        </div>
       :
       NomeMedico ? 
       <div className='flex flex-col justify-center items-center gap-5'>
        <h1 className='font-bold text-2xl text-blue-500 text-center'> Dr(a) o Intergestão esta disponivel apenas para Gestores de Saude!</h1>
       </div> 
       :
       NomePaciente ?
       <>
         <div className='flex flex-col justify-center items-center gap-5'>
        <h1 className='font-bold text-2xl text-blue-500 text-center'> Paciente, Intergestão esta disponivel apenas para Gestores de Saude!</h1>
       </div> 
       </>
       :
       <>
       <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='font-bold text-2xl text-blue-500 text-center'>Faça seu login pra acessar essa área da plataforma.</h1>
          <Link href="/welcome" className='w-full flex justify-center items-center'>
          <button className='p-2 rounded-full bg-blue-500 w-1/2'> 
          <p className='font-bold text-white'> Login </p> 
          </button>
          </Link>
       </div>
       </>
      }
   

      {onPopup &&
       <PacienteFaltando
       NomeUnidade={OriginalUnidadeUnidade}
       QuantidadePacientesFaltando={pacienteFaltando}
       Pacientes={pacientes}
       onClose={() => setOnPopup(false)}
       />
       }

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={20000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          <Typography>
            {snackbarMessage.split('\n').map((line, index) => (
              <span key={index} className="overflow-y-auto">
                {line}<br/>
              </span>
            ))}
          </Typography>
        </Alert>
      </Snackbar>

    </>
  );
};

export default ContentUnidade
