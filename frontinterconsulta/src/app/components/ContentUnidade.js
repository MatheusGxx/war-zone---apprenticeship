'use client'
import { useState, useRef, useEffect } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Snackbar , Alert, TextField, Autocomplete, CircularProgress, InputAdornment, Typography } from "@mui/material";
import {  AreadeAtuacaoAtendidas } from '../partials/AreadeAtuaçaoAtendidas.js'
import { useMutation } from '@tanstack/react-query'
import { MedicoCarousel } from '../partials/CarroselMédico.js'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

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

const ContentUnidade = () => {
  const[atuacao, setAtuacao] = useState('')
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

  const { vertical, horizontal } = position

  const currencySymbol = 'R$'
  
  const id = secureLocalStorage.getItem('id')

  const NameUnidadeSaude = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false
  
  const OriginalUnidadeUnidade = NameUnidadeSaude ? NameUnidadeSaude : ''

  const Route = usePathname()

  const CreateRequestMutation = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/process-planilha/${id}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) => {
      const CPFSPacientes = data.map((data) => data.CPF)
      PostConsolidado(CPFSPacientes)
      setMessageUnidade(`${OriginalUnidadeUnidade}, Nós acabamos de informar todos os Pacientes da sua planilha que voce esta procurando médico para eles!`)
    }
  })

  const CreateConsolidado = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/get-consolidado`, valueRequest)
    return response.data
  },{
    onSuccess: () => {
      setOkCasosClinicos(false)
    },
    onError: (err) => {
      setMessageErr(err.response.data.error)
      setSnackbarMessage(err.response.data.error)
      handleSnackBarOpen()
      setVisibileButton(true)
      setVisiblePlan(false)
      console.error(err.response.data.error)  
    }
  })

  const NotificationConfirmationDoctorAndPatient = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/notification-doctors-and-patients`, valueRequest)
    return response.data
  },{
    onSuccess: () => {
      PostFilaDeEspera()
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
      custo !== '' &&
      consolidado !== ''
    ) {
      divInfoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [horasMedicas, atendimentos, medicos, custo, consolidado, on, reset, inicio, fim, pacienteFaltando]);
  
  
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
    const file = event.target.files[0];
    const fileName = file ? file.name : ''
    setVisiblePlan(() => fileName)
    setVisibileButton(false)

    setSelectedFile(file);
  };

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
  }

  const PostConsolidado = async (CPFsPacientes) => {
    try{
      const data = await CreateConsolidado.mutateAsync({
        inicio: inicio,
        fim: fim,
        total: valorConsulta,
        consulta: valorConsulta,
        id: id,
        AreadeAtuacao:atuacao,
        CPFsPacientes: CPFsPacientes
      })

      setInicioMedicos(data.Inicio)
      setFimMedicos(data.Fim)
      setHorasMedicas(data.SomaAtendimentosDia)
      setAtendimentos(data.MessageAtendimentosDia)
      setMedicosDisponiveis(data.QuantidadeMedicosDisponiveis)
      setCusto(data.CustoEstilizado)
      setConsolidado(data.Consolidado)
      setSuccessData(data.MedicosDisponiveis)
      setOn(false)
    }catch(err){
      return err
    }

  }
 
  const HandleClickFinal = async () => {
    const formData = new FormData();
    formData.append("AreadeAtuacao", atuacao);
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
  
    if (atuacao === '' || inicio === '' || fim === '' || selectedFile === null || valorTotal === '' || valorConsulta === '') {
      setSnackbarMessage("Ops, você não preencheu todos os campos Obrigatórios para subir os seus Casos clinicos");
      handleSnackBarOpen();
    } else if (DataInicio >= DataFim) {
      setSnackbarMessage('Ops Unidade, a Data de Inicio sempre tem que ser inferior a Data Fim');
      handleSnackBarOpen();
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
      <div className='flex flex-col gap-10 m-10 sm:ml-0 sm:flex sm:justify-center md:justify-center'>
        {on === true ?
        <>
        <div className="flex items-center justify-center gap-10 sm:flex sm:flex-col sm:gap-5">
            <Autocomplete
              value={atuacao === '' ? null : atuacao}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setAtuacao(newValue);
                }
              }}
              options={AreadeAtuacaoAtendidas}
              noOptionsText="Sem resultados"
              renderInput={(params) => <TextField {...params} label="Area de Atuaçao Médica" variant="standard" />}
              className=" w-10/12 border-b border-blue-500 sm:w-full"
            />
            <TextField
              variant="standard"
              label="Inicio"
              InputProps={{
                sx: { borderBottom: "1px solid blue" },
              }}
              type="text"
              required
              onChange={handleInicioChange}
              className="w-1/3 sm:w-full"
              value={inicio}
            />
            <TextField
              variant="standard"
              label="Fim"
              InputProps={{
                sx: { borderBottom: "1px solid blue" },
              }}
              type="text"
              required
              onChange={handleFimChange}
              className="w-1/3 sm:w-full"
              value={fim}
            />
          </div>
          <div className='flex justify-center items-center gap-10'>
          <TextField
            variant="standard"
            label="Orçamento Disponivel"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{currencySymbol}</InputAdornment>
              ),
              sx: { borderBottom: '1px solid blue' },
            }}
            type="text"
            required
            onChange={handleValorTotalChange}
            value={valorTotal}
          />
          <TextField
            variant="standard"
            label="Valor da Consulta"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{currencySymbol}</InputAdornment>
              ),
              sx: { borderBottom: '1px solid blue' },
            }}
            type="text"
            required
            onChange={handleValorConsultaChange}
            value={valorConsulta}
          />
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={hiddenFileInput}
          />
              
           <div className="flex justify-center flex-col items-center gap-5">
      
           {visibleButton ?
              <button className="bg-blue-600 rounded-full w-52 h-10 flex gap-3 p-2" onClick={handleClick}>
              <CloudUploadIcon style={{ color: 'white' }} />
              <p className='text-white font-bold'> Subir casos Clinicos</p>
              </button>
                : ''
            }
          
            {visiblePlan ? 
              <>
                <div className="flex items-center justify-center">
                <h1> Nome da Planilha selecionada: <span className="font-bold text-blue-500">{visiblePlan}</span> <DeleteIcon color="primary" onClick={RemoveFileChange} className="cursor-pointer"/> </h1> 
                 </div>
                </>
           : ''}
           
           
           {visiblePlan && messageErr === '' ?   
           <button className='bg-blue-600 rounded-full p-2 w-full' onClick={HandleOkCasosClinicos}>
            <p className='font-bold text-white'> Enviar Casos Clinicos </p>
           </button> : ''
           }       

            {okCasosClinicos && messageErr === '' && 
            <div className='flex gap-4 flex-col justify-center items-center'>
              <div className='flex gap-4'>
              <InsertEmoticonIcon color="primary" fontSize='large'/>
              <h1 className='font-bold text-blue-500 text-center'> {messageUnidade} </h1>
              </div>
              <div className='flex gap-4'>
              <CircularProgress color="primary" size={24}/>
              <h1 className='font-bold text-blue-500 animate-pulse text-center'> Aguarde Estamos preparando o Consolidado para a sua gestão </h1>
              </div>
            </div>
            }
        </div>
        </>
         : ''}
          

        {horasMedicas !== '' && atendimentos !== '' && medicos && custo !== '' && consolidado !== '' && successData !== null ?
          <>
        <div className='flex justify-center items-center flex-col gap-5'>
          <div className=' flex justify-center items-center flex-col border-blue-500 border-4 rounded-lg w-full p-5 gap-5' ref={divInfoRef}>
        
           <div className="flex gap-5 justify-center items-center mb-5 mt-5">
              <Image src={Logo} alt="Logo Interconsulta" height={40} width={40} className="animate-spin-slow"/>
              <h1 className='text-2xl text-blue-600 font-bold'> {OriginalUnidadeUnidade} Segue a sua Programaçao abaixo </h1>
           </div>
           <div className="flex justify-center items-center flex-wrap gap-10 mb-5">
             <TextField
             variant="standard"
             label="Data Inicio"
             InputProps={{
               sx: { borderBottom: '1px solid blue' },
               readOnly: true,
             }}
             type="text"
             required
             onChange={(e) => setInicioMedicos(e.target.value)}
             className="w-1/3 sm:w-full"
             value={InicioMedicos}
           />
        
            <TextField
             variant="standard"
             label="Data Fim"
             InputProps={{
               sx: { borderBottom: '1px solid blue' },
               readOnly: true,
             }}
             type="text"
             required
             onChange={(e) => setFimMedicos(e.target.value)}
             className="w-1/3 sm:w-full"
             value={FimMedicos}
           />
           <TextField
             variant="standard"
             label="Total Atendimentos Disponiveis"
             InputProps={{
               sx: { borderBottom: '1px solid blue' },
               readOnly: true,
             }}
             type="text"
             required
             onChange={(e) => setHorasMedicas(e.target.value)}
             className="w-1/3 sm:w-full"
             value={horasMedicas}
            />
           <TextField
           variant="standard"
           label="Orçamento Estimado"
           InputProps={{
             sx: { borderBottom: '1px solid blue' },
             readOnly: true,
           }}
           type="text"
           required
           onChange={(e) => setCusto(e.target.value)}
           className="w-1/3 sm:w-full"
           value={custo}
                  />
        </div>

          {CreateRequestMutation.isLoading &&
                <Image src={Logo} alt="Logo Interconsulta" height={50} width={50} className="animate-pulse"/>
          }
        {successData &&
            <>
          <div className='flex gap-5'>
              <Image src={Logo} alt="Logo Interconsulta" height={30} width={30} className="animate-spin-slow"/>
              <h2 className='text-blue-600 font-bold text-2xl'> Profissionais em {atuacao} ({medicos})</h2>
              </div>
          </>
        }

       <div className="border-b-2 border-blue-500  w-full  pt-3 sm:hidden md:hidden lg:hidden xl:hidden"></div>

       <div className='flex gap-5 justify-center items-center whitespace-nowrap'>
          <Image src={Logo} alt="Logo Interconsulta" height={30} width={30} className="animate-bounce"/>
          <h1 className='font-bold text-red-600 whitespace-pre-wrap text-center'> {consolidado} </h1>
       </div>
    </div>

      {pacienteFaltando && 
        <> 
        <button className="border-red-500 border-4 rounded-lg p-2 animate-pulse" onClick={HandlePopUp}>
          <p className='font-bold text-red-500'>  {OriginalUnidadeUnidade} tem {pacienteFaltando}  Pacientes da sua Demanda sobrando, clique aqui para ve-los!</p>
        </button>
        </>
      }

    <div className={`flex gap-5 ${NotificationConfirmationDoctorAndPatient.isSuccess && agendamentoOn && 'flex-col gap-5'}`}>
      <button 
        className={`${NotificationConfirmationDoctorAndPatient.isSuccess && agendamentoOn ? 'bg-blue-500' : 'bg-green-400'}
          p-2 rounded-full text-white font-bold min-w-[150px] flex items-center justify-center gap-5 cursor-pointer`}
        onClick={NotificationPatientsAndDoctor}
        disabled={agendamentoOn === true || NotificationConfirmationDoctorAndPatient.isLoading}
      >
        {NotificationConfirmationDoctorAndPatient.isLoading ? (
          <>
          <CircularProgress size={24} /> Estamos Notificando os Nossos Médicos Aguarde...<div className='flex justify-center items-center'> </div>
          </>
        ) : (
          <p className='whitespace-nowrap'>
            {NotificationConfirmationDoctorAndPatient.isSuccess && agendamentoOn
              ? `${OriginalUnidadeUnidade} Obrigado por solicitar o agendamento todos os Médicos e Pacientes foram Notificados!`
              : 'Solicitar Agendamento'}
          </p>
        )}
      </button>

      <button>
        <h2 className='text-red-600 font-bold whitespace-nowrap cursor-pointer' onClick={Reset}>
          Refazer Programação
        </h2>
      </button>
    </div>

      </div>
       </>
          : ''}
      </div>

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
