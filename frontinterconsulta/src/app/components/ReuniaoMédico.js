'use client'
import { useState, useEffect } from "react"
import { FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, CircularProgress } from "@mui/material"
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
import { PopUpWarningDoctor } from "../partials/PopUpWarning.jsx"

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

  const [date, setDateNow] = useState(null)
  const [hora, setHoraAtual] = useState(null)
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [endConsulta, setEndConsulta] = useState(false)

  const [historico, setHistorico] = useState(false)
  const [CPF, setCPF] = useState(null)
  const [generateDocuments, setGenerateDocuments] = useState(false)


  ///////////////// ----- Documentos --------- /////////////////

  const [nomeDoctor, setNomeDoctor] = useState(null)
  const [crmDoctor, setCmrDoctor] = useState(null)
  const [ufDoctor, setUfDoctor] = useState(null)
  const [estadoDoctor, setEstadoDoctor] = useState(null)
  const [bairroDoctor, setBairroDoctor] = useState(null)
  const [cidadeDoctor, setCidadeDoctor] = useState(null)
  const [enderecoDoctor, setEnderecoDoctor] = useState(null)
  const [cidadePaciente, setCidadePaciente] = useState(null)
  const [estadoPaciente, setEstadoPaciente] = useState(null)
  const [cpfDoctor, setCPFDoctor] = useState(null)
  const [enderecoPaciente, setEnderecoPaciente] = useState(null)
  const [visualizedDocuments, setVisualizedDocuments] = useState(false)
  const { reuniaoAcabando } = UseReuniaoAcabando()
  const Router = useRouter()

  const CRMMédico = secureLocalStorage.getItem('CRMMedico')
  
  useEffect(() => {

  },[startConsulta, nameInitialPatient, receitaSimples, receitaControlada, diasAfastamento, SolicitarExames ])

  useEffect(() => {

    const DateNow = new Date();

    const Dia = DateNow.getDate();
    const Mes = DateNow.getMonth() + 1;
    const Ano = DateNow.getFullYear();

    const DataAtual = `${Dia}/${Mes}/${Ano}`;
    setDateNow(DataAtual);

    const Horas = DateNow.getHours();
    const Minutos = DateNow.getMinutes();
    const Segundos = DateNow.getSeconds();

    const HoraAtual = `${Horas}:${Minutos}:${Segundos}`;
    setHoraAtual(HoraAtual)

  },[date, hora])

  const VerifyEndRoomMutation = useMutation( async (valueBody) =>{
    const request = await axios.post(`${config.apiBaseUrl}/api/verify-conclusion-room`, valueBody)
    return request.data.Consulta
  })
  
  const idLocal = secureLocalStorage.getItem('id');
  const id = idLocal || ''

  const IdentificadorLocalConsulta = secureLocalStorage.getItem('ConsultaPacienteParticular')
  const IdentificadorConsulta = IdentificadorLocalConsulta || ''
  const NomeMedico = secureLocalStorage.getItem('NomeMedico')

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
      const CidadePaciente = request.data.getConsulta.map((data) => data.CidadePaciente)
      setCidadePaciente(CidadePaciente)
      const EstadoPaciente = request.data.getConsulta.map((data) => data.EstadoPaciente)
      setEstadoPaciente(EstadoPaciente)
      const EnderecoPaciente = request.data.getConsulta.map((data) => data.EnderecoPaciente)
      setEnderecoPaciente(EnderecoPaciente)
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
      setCPFDoctor(request.data.getDoctor.CPFMedico)
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

  const ValidatorDocumentsDoctor = useMutation(async (valueBody) => {
    try{
      const response = await axios.post(`${config.apiBaseUrl}/api/validator-documents`, valueBody)
      return response.data
    }catch(error){
      throw new Error('Erro ao Validar documentos do Médico')
    }
  })

  useEffect(() => {

  },[snackbarMessage, snackbarOpen])

  useEffect(() => {
    if (reuniaoAcabando) {
      setSnackbarMessage(`Atenção ${NomeMedico}! Faltam menos de 5 minutos para a consulta acabar!`);
      handleSnackBarOpen();
    }
  }, [reuniaoAcabando, NomeMedico]);
  
  const ButtonHandleClick = async () => {

    let camposVazios = [];
    
    if (ficha === '') {
      camposVazios.push('Ficha do Paciente')
    }
    if (estado === '') {
      camposVazios.push('Estado do caso clinico')
    }
    if (Diagnóstico === '') {
      camposVazios.push('Diagnóstico');
    }
    if(Tratamento === ''){
      camposVazios.push('Tratamento')
    }

     if(camposVazios.length > 0){
      const camposFaltantes = camposVazios.join(', ')
      setSnackbarMessage(`${NomeMedico}, tem campos obrigatórios faltando serem preenchidos, segue os campos que voce nao preencheu: ${camposFaltantes}`)
      handleSnackBarOpen()
     }else{
        HandleClickButtonFinal()
        setCurrentPatientIndex((prevIndex) => prevIndex + 1)
        setTotalPatients((prev) => prev + 1)
     }
  }

  const HandleClickButtonFinal = async () => {

    let DocumentosPreenchidos = []

    if (receitaSimples !== '') {
      DocumentosPreenchidos.push('Receita Simples')
    }
    if (receitaControlada !== '') {
      DocumentosPreenchidos.push('Receita Controlada')
    }
    if (diasAfastamento !== null ) {
      DocumentosPreenchidos.push('Dias de Afastamento')
    }
    if(cid !== ''){
      DocumentosPreenchidos.push('CID')
    }
    if(SolicitarExames.length > 0){
      DocumentosPreenchidos.push('Solicitação de Exames')
    }

     if(DocumentosPreenchidos.length > 0) 
     {
      const DocumentoEsquecidos = DocumentosPreenchidos.join(', ')
      setSnackbarMessage(`${NomeMedico}, Voce preencheu: ${DocumentoEsquecidos}, entretando nao salvou, tem certeza que deseja continuar?`)
      handleSnackBarOpen()
     }
                   
     const dataValidator = await ValidatorDocumentsDoctor.mutateAsync({ id: IdentificadorConsulta })
     const FaltandoDocumento = dataValidator.missingDocuments

     if(FaltandoDocumento){
      setSnackbarMessage(`${NomeMedico} os seguintes documentos: ${FaltandoDocumento},  Solicitados pelo Paciente ${nameInitialPatient} estão faltando`),
      handleSnackBarOpen()
     }else{
      setEndConsulta(true)  
     }
           
    /*const body1 = {
      IdentificadorConsulta: IdentificadorConsulta, 
      id: id
    };
    const data = await VerifyEndRoomMutation.mutateAsync(body1);
  
    const OkMedico = data.ConsultasSolicitadasPacientes.flatMap((data) => data.OkMedico)

    const OkPaciente = data.ConsultasSolicitadasPacientes.flatMap((data) => data.OkPaciente)
  
    if (OkMedico.length === 0) {     
      setOpen(true);
      setNomeMedico(data.ConsultasSolicitadasPacientes.map((data) => data.Solicitado));
    } else if (OkPaciente.length === 0) {
      setOpen(true);
      setNomePaciente(data.ConsultasSolicitadasPacientes.map((data) => data.Solicitante));
    } else {
      
    }*/

     
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

  return(
    <>
  
    <>
    <div className="w-1/2 flex flex-col justify-center overflow-y-auto">
         <div className="flex flex-col gap-5">
         {getPacientes.data?.getConsulta?.map((data, index) => (
            <div key={index} className={`flex flex-col gap-5 justify-center items-center mt-[-1rem]`}>
              <h2 className='text-center font-bold text-xl text-blue-900'>{`Paciente Atual: ${data.nome}`}</h2>  
              <button className="w-1/3  h-10 bg-blue-900 rounded-full font-bold text-white sm:w-11/12 sm:h-8 md:w-3/4 lg:w-3/4 xl:w-3/4 cursor-pointer"
                          onClick={() =>
                            HandleHistorico()
                           }>
                            <p className="sm:text-sm text-center"> Historico </p>
             </button>
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
                      setSnackbarMessage={setSnackbarMessage}
                      handleSnackBarOpen={() => handleSnackBarOpen()}
                      NomeMedico={nomeDoctor}
                      NomePaciente={nameInitialPatient}
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

      {endConsulta && 
      <PopUpWarningDoctor 
        onClose={() => setEndConsulta(false)}
        ficha={ficha}
        Diagnóstico={Diagnóstico}
        Tratamento={Tratamento}
        FerramentaTerapeutica={FerramentaTerapeutica}
        Progresso={Progresso}
        SolicitaçaoMateriais={SolicitaçaoMateriais}
        Recomendacoes={Recomendacoes}
        estado={estado}
        ReceitaSimpleS={receitaSimples}
        ReceitaControlada={receitaControlada}
        diasAfastamento={diasAfastamento}
        SolicitarExames={SolicitarExames}
        nomePaciente={nameInitialPatient}
        nomeMedico={nomeDoctor}
        CRMMedico={crmDoctor}
        UFMedico={ufDoctor}
        EstadoMedico={estadoDoctor}
        BairroMedico={bairroDoctor}
        CidadeMedico={cidadeDoctor}
        CPFPaciente={CPF}
        EnderecoMedico={enderecoDoctor}
        CID={cid}
        CidadePaciente={cidadePaciente}
        EstadoPaciente={estadoPaciente}
        CPFMedico={cpfDoctor}
        EnderecoPaciente={enderecoPaciente}
        IdentificadorConsulta={IdentificadorConsulta}
        date={date}
        hora={hora}
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