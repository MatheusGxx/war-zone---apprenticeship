'use client'
import { useState, useEffect } from "react"
import { FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material"
import { AccordionReuniaoMédico } from "../partials/AccordionReuniao.jsx"
import { AccordionReuniaoMédico2 } from '../partials/AccordionReuniao2.jsx'
import { AccordionReuniaoMédico3 } from "../partials/AccordionReuniao3.jsx"   
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { saveAs } from 'file-saver';
import { CasosClinicoReuniao } from "../partials/PopUpCasoClinicoReuniao.js"
import { PopUpEndReunião } from '../partials/popUpEndReuniao.js'
import { useRouter } from 'next/navigation'
import { UseReuniaoAcabando } from "../context/context.js"
import { config } from '../config.js'
import { Documents } from "../partials/Documents.jsx"
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

const ReuniaoMédico = () =>{

  const [estado, setEstado] = useState('')
  const [solicitaçao, setSolicitaçao] = useState('')
  const [Diagnóstico, setDiagnóstico] = useState('')
  const [Tratamento, setTratamento] = useState('')
  const [receitaSimples, setReceitaSimples]  = useState('')
  const [receitaControlada, setReceitaControlada] = useState('')
  const [FerramentaTerapeutica, setFerramenta] = useState('')
  const [Progresso, setProgresso] = useState('')
  const [SolicitaçaoMedicamentos, setSolicitaçaoMedicamentos] = useState('')
  const [SolicitaçaoMateriais, setSolicitaçaoMateriais] = useState('')
  const [SolicitarExames, setSolicitarExames] = useState([])
  const [Recomendacoes, setRecomendacoes] = useState('')
  const [startConsulta, SetStartConsulta] = useState('')
  const [nameInitialPatient, setNameInitialPatient] = useState('')
  const [ficha, setFicha] = useState('')
  const [diasAfastamento, setDiasAfastamento] = useState(null)
  const [cid, setCID] = useState('')


  const[open, setOpen] = useState('')
  const[nomePaciente, setNomePaciente ] = useState('')
  const[nomeMedico, setNomeMedico] = useState('') 

  const[snackbarOpen, setSnackbarOpen] = useState(false)
  const[snackbarMessage, setSnackbarMessage] = useState("")
  const[position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  })

  const [value, setValue] = useState('1');

  const { vertical, horizontal } = position

  const [currentPatientIndex, setCurrentPatientIndex] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0);

  const [historico, setHistorico] = useState(false)
  const [CPF, setCPF] = useState(null)
  const [generateDocuments, setGenerateDocuments] = useState(false)


  ///////////////// ----- Documento Solicitaçao de Exames --------- /////////////////

  const [nomeDoctor, setNomeDoctor] = useState(null)
  const [crmDoctor, setCmrDoctor] = useState(null)
  const [ufDoctor, setUfDoctor] = useState(null)
  const [estadoDoctor, setEstadoDoctor] = useState(null)
  const [bairroDoctor, setBairroDoctor] = useState(null)
  const [cidadeDoctor, setCidadeDoctor] = useState(null)
  const [enderecoDoctor, setEnderecoDoctor] = useState(null)
  const { reuniaoAcabando } = UseReuniaoAcabando()
  const Router = useRouter()

  useEffect(() => {

  },[startConsulta, nameInitialPatient, receitaSimples, receitaControlada, diasAfastamento, SolicitarExames])

  const VerifyEndRoomMutation = useMutation( async (valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/verify-conclusion-room`, valueBody)
    return request.data.Consulta
  })

  const SavedConsulta = useMutation(async(valueBody) =>{
     const request = await axios.post(`${config.apiBaseUrl}/api/conclusion-room-medico`, valueBody)
     return request.data
  })
 
  const RequestCreatingDoctorLaudo = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/create-laudo-medico`, valueRequest, {
      responseType: 'blob',
 })
    return response.data
  }, {
    onSuccess: (data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      saveAs(blob, 'laudo.pdf');
    },
    onError: (error) => {
      console.error(error);
      setSnackbarMessage('Erro ao gerar o Laudo Médico');
      handleSnackBarOpen();
    }
  })

  const ConclusionConsultaDeleteHorario = useMutation(async(valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/conclusion-consulta-delete-horario`, valueBody)
    return request.data
 })
  

  const idLocal = secureLocalStorage.getItem('id');
  const id = idLocal || ''

  const IdentificadorLocalConsulta = secureLocalStorage.getItem('ConsultaPacienteParticular')
  const IdentificadorConsulta = IdentificadorLocalConsulta || ''
  const NomeMedico = secureLocalStorage.getItem('NomeMedico')
  const CRMMédico = secureLocalStorage.getItem('CRMMedico')
  
  const getPacientes = useMutation(async (valueBody) => {
    try {
      const request = await axios.post(`${config.apiBaseUrl}/api/get-consulta`, valueBody);
      const pacientes = request.data.getConsulta || []
      setTotalPatients(pacientes.length)
      const NomeInitialPatient = request.data.getConsulta.map((data) => data.nome)
      const NomeOriginalPatient = NomeInitialPatient.join(',')
      setNameInitialPatient(NomeOriginalPatient)
      const CPFPaciente = request.data.getConsulta.map((data) => data.CPF)
      setCPF(CPFPaciente)
      return request.data
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error
    }
  })

  const getDataMedico = useMutation(async(valueBody) =>{
    try{
      const request = await axios.post(`${config.apiBaseUrl}/api/get-data-doctor-room`, valueBody)
      setNomeDoctor(request.data.getDoctor.NomeEspecialista)
      setCmrDoctor(request.data.getDoctor.CRM)
      setUfDoctor(request.data.getDoctor.UFCRM)
      setEstadoDoctor(request.data.getDoctor.Estado)
      setBairroDoctor(request.data.getDoctor.Bairro)
      setCidadeDoctor(request.data.getDoctor.Cidade)
      setEnderecoDoctor(request.data.getDoctor.EnderecoMedico)
      setCPFDoctor(request.data.getDoctor.CPF)
      return request.data.getDoctor
    }catch(error){
      console.log(error)
    }
 })
  
  useEffect(() => {
    const body = {
      IdentificadorConsulta: IdentificadorConsulta
    }
    getPacientes.mutateAsync(body)
  }, [])

  useEffect(() => {
     getDataMedico.mutateAsync({ id: id })
  },[])

  useEffect(() => {
    if (reuniaoAcabando) {
      setSnackbarMessage(`Atenção ${NomeMedico}! Faltam menos de 5 minutos para a consulta acabar!`);
      handleSnackBarOpen();
    }
  }, [reuniaoAcabando, NomeMedico]);
  
  const ButtonHandleClick = async () => {
     if(estado === '' || solicitaçao === '' || Diagnóstico === '' || Tratamento === '' || Medicaçao === '' || FerramentaTerapeutica === '' || Progresso === '' || Recomendacoes === ''){
      setSnackbarMessage(`${NomeMedico} por favor preencha todos os dados solicitados abaixo para poder finalizar a consulta`)
      handleSnackBarOpen()
     }else{
        HandleClickButtonFinal()
        setCurrentPatientIndex((prevIndex) => prevIndex + 1)
        setTotalPatients((prev) => prev + 1)
     }
  }

  const HandleClickButtonFinal = async () => {
    const body1 = {
      IdentificadorConsulta: IdentificadorConsulta,
      id: id
    };
    const data = await VerifyEndRoomMutation.mutateAsync(body1);
  
    const OkMedico = data.ConsultasSolicitadasPacientes.flatMap((data) => data.OkMedico);
 
    const OkPaciente = data.ConsultasSolicitadasPacientes.flatMap((data) => data.OkPaciente);
  
    if (OkMedico.length === 0) {     
      setOpen(true);
      setNomeMedico(data.ConsultasSolicitadasPacientes.map((data) => data.Solicitado));
    } else if (OkPaciente.length === 0) {
      setOpen(true);
      setNomePaciente(data.ConsultasSolicitadasPacientes.map((data) => data.Solicitante));
    } else {
      
      const dataAtual = new Date()

      const anoAtual = dataAtual.getFullYear();
      const mesAtual = dataAtual.getMonth() + 1
      const diaAtual = dataAtual.getDate();

      const body2 ={
        id: id,
        IdentificadorConsulta: IdentificadorConsulta,
        Diagnostico: Diagnóstico,
        Tratamento: Tratamento,
        Medicacao: Medicaçao,
        FerramentasTerapeuticas: FerramentaTerapeutica,
        Progresso: Progresso,
        SolicitacaoMedicamentos: SolicitaçaoMedicamentos,
        SolicitacaoMateriais: SolicitaçaoMateriais,
        SolicitacaoExames: SolicitarExames,
        RecomendacoesFuturas: Recomendacoes,
        EstadoPaciente: estado,
        Solicitacao: solicitaçao,
        CRMMedicoAtendeu: CRMMédico,
        DataInsercao: `${diaAtual}/${mesAtual}/${anoAtual}`
      }
       await SavedConsulta.mutateAsync(body2)
  
      const body3 = {
        idMedico: id,
        IdentificadorConsultaPaciente: IdentificadorConsulta,
        Diagnostico: Diagnóstico,
        TratamentoPrescrito: Tratamento,
        MedicacaoPrescrita: SolicitaçaoMedicamentos,
        FerramentaTerapeutica: FerramentaTerapeutica,
        ProgressoPaciente: Progresso,
        RecomendacoesFuturas: Recomendacoes,
      }
      try{
        RequestCreatingDoctorLaudo.mutateAsync(body3)
        secureLocalStorage.setItem('EndMedico',IdentificadorConsulta)
        ConclusionConsultaDeleteHorario.mutateAsync({ idConsultaParticular: IdentificadorLocalConsulta})
        secureLocalStorage.removeItem('ConsultaPacienteParticular')
        setEstado('')
        setSolicitaçao('')
        setDiagnóstico('')
        setTratamento('')
        setMedicaçao('')
        setFerramenta('')
        setProgresso('')
        setSolicitaçaoMedicamentos('')
        setSolicitaçaoMateriais('')
        setSolicitarExames('')
        setRecomendacoes('')
        Router.push('/obrigado')
      }catch(error){
        console.log(error)
      }  
    }
  }

  const HandleHistorico = async () => { 
    setHistorico(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const HandleGenerateDocuments = () => {
    setGenerateDocuments(true)
  }


  return(
    <>
  
    <>
    <div className="w-6/12 flex flex-col justify-center">
         <div className="flex flex-col gap-5">
         {getPacientes.data?.getConsulta?.map((data, index) => (
            <div key={index} className={`flex flex-col gap-5 ${index === currentPatientIndex ? '' : 'hidden'} justify-center items-center mt-[-1rem]`}>
              <h1 className='text-center font-bold text-xl text-blue-900'>{`Pacientes: ${currentPatientIndex + 1}/${totalPatients}`}</h1>
              <h2 className='text-center font-bold text-xl text-blue-900'>{`Paciente Atual: ${data.nome}`}</h2>
            </div>
          ))}

                  <div className='w-full flex justify-center items-center'>
                   
                  <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="flex justify-center">
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                          <Tab label="Ficha do Paciente" value="1" />
                          <Tab label="Documentos" value="2" />
                          <Tab label="Açoes" value="3" />
                        </TabList>
                      </Box>
                      <TabPanel value="1" >
                        <AccordionReuniaoMédico
                        setFicha={setFicha}
                        ficha={ficha}
                        setDiagnóstico={setDiagnóstico}
                        Diagnóstico={Diagnóstico}
                        setTratamento={setTratamento}
                        Tratamento={Tratamento}
                        setFerramenta={setFerramenta}
                        FerramentaTerapeutica={FerramentaTerapeutica}
                        setProgresso={setProgresso}
                        Progresso={Progresso}
                        />
                      </TabPanel>
                      <TabPanel value="2">
                        <AccordionReuniaoMédico2
                        setReceitaSimples={setReceitaSimples}
                        receitaSimples={receitaSimples}
                        setReceitaControlada={setReceitaControlada}
                        receitaControlada={receitaControlada}
                        setDiasAfastamento={setDiasAfastamento}
                        diasAfastamento={diasAfastamento}
                        setCID={setCID}
                        cid={cid}
                        setSolicitarExames={setSolicitarExames}
                        SolicitarExames={SolicitarExames}
                        IdentificadorConsulta={IdentificadorConsulta}
                        />
                      </TabPanel>
                      <TabPanel value="3">
                      <AccordionReuniaoMédico3
                      setSolicitaçaoMedicamentos={setSolicitaçaoMedicamentos}
                      SolicitaçaoMedicamentos={SolicitaçaoMedicamentos}
                      setSolicitaçaoMateriais={setSolicitaçaoMateriais}
                      SolicitaçaoMateriais={SolicitaçaoMateriais}
                      setRecomendacoes={setRecomendacoes}
                      Recomendacoes={Recomendacoes}
                      />
                      </TabPanel>
                    </TabContext>
                  </Box>
                  </div>

                  <div className="flex justify-center gap-5 cursor-pointer" onClick={HandleGenerateDocuments}>
                  <DownloadForOfflineIcon color="primary" fontSize="large"/>        
                  <div className="flex justify-center items-center">
                  <h1 className="font-bold text-blue-900 text-lg"> Gerar Documentos </h1>
                  </div>
                  </div>

                   {generateDocuments ?
                    Medicaçao && diasAfastamento && SolicitarExames ?
                    <div className="flex justify-center items-center gap-5">
                      <button> Receita Simples </button>
                      <button> Atestado </button>
                      <button> Exames </button>
                    </div>
                    :
                    Medicaçao && diasAfastamento  ?
                      <div className="flex justify-center items-center gap-5 w-full">
                      <button> Receita Simples </button>
                      <button> Atestado </button>
                      </div>
                    : Medicaçao ? 
                    <div className="flex justify-center items-center w-full">
                      <div className="w-1/2 flex border-blue-500 border-2 rounded-full gap-5 justify-center items-center ">
                      <ModeEditIcon color="primary" className="cursor-pointer"/>
                      <button className="font-bold text-blue-900"> Receita Simples </button>
                      </div> 
                    </div>
                    :
                    <div className="flex justify-center items-center">
                      <p className="font-bold text-blue-950"> Nenhum documento foi preenchido</p>
                    </div>
                    : null
                    }  

                    <div className="flex gap-5 justify-center items-center">
                        <FormControl
                          className="w-64 sm:w-44 border-b border-blue-600"
                          style={{ borderBottom: '1px solid blue' }}
                        >
                          <InputLabel>Estado do Caso Clinico</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={estado}
                            label="Estado do Caso Clinico"
                            onChange={(e) => setEstado(e.target.value)}
                            variant="standard"
                          >
                            <MenuItem value="Aguardando Avaliação do Especialista">Aguardando Avaliação do Especialista</MenuItem>
                            <MenuItem value="Aguardando Cirurgia">Aguardando Cirurgia</MenuItem>
                            <MenuItem value="Atendimento Encerrado">Atendimento Encerrado</MenuItem>
                            <MenuItem value="Aguardando Exame">Aguardando Exame</MenuItem>
                          </Select>
                        </FormControl>
                        </div>
            
                      <div className="flex gap-5 w-full justify-center">
                          <button className="w-1/3  h-10 bg-blue-900 rounded-full font-bold text-white sm:w-11/12 sm:h-8 md:w-3/4 lg:w-3/4 xl:w-3/4 cursor-pointer"
                          onClick={ButtonHandleClick}       
                      >
                            <p className="sm:text-sm text-center"> Finalizar Interconsulta </p>
                          </button>
            
                          <button className="w-1/3  h-10 bg-blue-900 rounded-full font-bold text-white sm:w-11/12 sm:h-8 md:w-3/4 lg:w-3/4 xl:w-3/4 cursor-pointer"
                         onClick={() =>
                          HandleHistorico()
                          }>
                            <p className="sm:text-sm text-center"> Historico </p>
                          </button>
                      </div>
                 </div>

              

      {historico &&
        <CasosClinicoReuniao
        onClose={() => setHistorico(false)}
        CPF={CPF}
        />
      }
      {open && 
      <PopUpEndReunião
      PersonaNaoclicou={nomeMedico ? nomeMedico : nomePaciente ? nomePaciente : null}
      onClose={() => setOpen(false)}
      />
      }

      {generateDocuments &&
       <Documents
       onClose={() => setGenerateDocuments(false)}
       Medicaçao={Medicaçao}
       diasAfastamento={diasAfastamento}
       SolicitarExames={SolicitarExames}
       />
      }
      
      </div>
    </>
    

       <Snackbar
        open={snackbarOpen}
        autoHideDuration={20000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  )
}

export default ReuniaoMédico