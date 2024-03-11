import { Router } from 'express'
import { Job, QueueEvents } from 'bullmq';

const router = Router()

import { 
  AutomaticWhatsapp, 
  sendDocumentsPatient, 
  SavedConsultaUnidadeSaude,
  AcceptMedical,
  RejectMedical,
  WarningDoctorNotSchedules,
  WarningDoctorHorariosAntigos
} from '../../services/AutomaticService.js'

import uploadSignedDocuments from '../../utils/MulterSignDocuments.js'
import uploadPlanilha from '../../utils/MulterPlanilha.js'
import config from '../../utils/RedisConnection.js'
const { redisRead, redisWrite } = config

import { 
   ProcessPlanilhaQueue,
   ProcessConsolidadoQueue, 
   BulkMessageQueueConfirmation,
} from '../../utils/Queues.js'

router.post('/automatic-whatsapp', async (req, res) => {

  console.log(req.body)

  const body = {
    IdentificadorMedico: req.body.IdentificadorMedico,
    IdentificadorPaciente: req.body.IdentificadorPaciente,
    IdentificadorUnidade: req.body.IdentificadorUnidade,
    IdentificadorObrigadoMedico: req.body.IdentificadorObrigadoMedico,
    IdentificadorObrigadoPaciente: req.body.IdentificadorObrigadoPaciente,
    IdentificadorObrigadoUnidade: req.body.IdentificadorObrigadoUnidade,
    IdentificadorUnidadeSaudeRoute: req.body. IdentificadorUnidadeSaudeRoute,
    IdentificadorPacientePublico: req.body.IdentificadorPacientePublico,
    IdentificadorPacienteParticular: req.body. IdentificadorPacienteParticular,
    TelefoneMedicoAgendamento: req.body.TelefoneMedicoAgendamento,
    EmailMedico: req.body.EmailMedico,
    NomeMedico: req.body.NomeMedico,
    NomePaciente: req.body.NomePaciente,
    DataAgendamento: req.body.DataAgendamento,
    InicioAgendamento: req.body.InicioAgendamento,
    FimAgendamento: req.body.FimAgendamento,
    EmailPacienteAceitouConsulta: req.body.EmailPacienteAceitouConsulta,
    NomeMedicoAceitouConsulta: req.body.NomeMedicoAceitouConsulta,
    NumeroPacienteAceitouConsulta: req.body.NumeroPacienteAceitouConsulta,
    NomePacienteAceitouConsulta: req.body.NomePacienteAceitouConsulta,
    DataAceitouConsulta: req.body.DataAceitouConsulta,
    InicioAceitouConsulta: req.body.InicioAceitouConsulta,
    FimAceitouConsulta: req.body.FimAceitouConsulta,
    EmailPacienteRejeitouConsulta: req.body.EmailPacienteRejeitouConsulta,
    NomeMedicoRejeitouConsulta: req.body.NomeMedicoRejeitouConsulta,
    NumeroPacienteRejeitouConsulta: req.body.NumeroPacienteRejeitouConsulta,
    NomePacienteRejeitouConsulta: req.body.NomePacienteRejeitouConsulta,
    DataRejeitouConsulta: req.body.DataRejeitouConsulta,
    InicioRejeitouConsulta: req.body.InicioRejeitouConsulta,
    FimRejeitouConsulta: req.body.FimRejeitouConsulta,
    DoencaRejeitouConsulta: req.body.DoencaRejeitouConsulta,
    EmailMedicoExclusao: req.body.EmailMedicoExclusao,
    NumeroMedicoExclusao:req.body.NumeroMedicoExclusao,
    NomeMedicoExclusao: req.body.NomeMedicoExclusao,
    NomePacienteExclusao: req.body.NomePacienteExclusao,
    DataExclusaoPaciente: req.body.DataExclusaoPaciente,
    InicioExlusaoPaciente: req.body.InicioExlusaoPaciente,
    FimExclusaoPaciente: req.body.FimExclusaoPaciente,
    FichaPaciente: req.body.FichaPaciente,
    Diagnostico: req.body.Diagnostico,
    Tratamento: req.body.Tratamento,
    FerramentasTerapeuticas: req.body.FerramentasTerapeuticas,
    Progresso: req.body.Progresso,
    SolicitacaoMateriais: req.body.SolicitacaoMateriais,
    RecomendacoesFuturas: req.body.RecomendacoesFuturas,
    EstadoPaciente: req.body.EstadoPaciente,
    ReceitaSimples: req.body.ReceitaSimples,
    ReceitaControlada: req.body.ReceitaControlada,
    Atestado: req.body.Atestado,
    Exame:  req.body.Exame,
    result: req.body.result,
    route: req.body.route
  }

  const response = res

  AutomaticWhatsapp(body, response)
}) 

router.post('/send-documents-patient', uploadSignedDocuments.any(), 
       async(req,res) => {

        console.log(req.body)
        console.log(req.files)

        const files = req.files

        const PathDocumentSign = files.map((data) => data.path)
        console.log(PathDocumentSign)

        const { id } = req.body
        sendDocumentsPatient(id, res, PathDocumentSign)
       }
)

router.post('/process-planilha/:id', uploadPlanilha.single('file'), async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.file);

  const body = {
    EspecialidadeMedica: req.body.EspecialidadeMedica,
  };

  const params = {
    id: req.params.id,
  };
  const file = req.file;
  const PathPlanilha = file.path;
  const Filename = file.filename

  await ProcessPlanilhaQueue.add('ProcessPlanilha', {
    body,
    params, 
    PathPlanilha, 
    Filename
  })

  const queueEvents = new QueueEvents('ProcessPlanilha', { connection: redisRead })
  const queue = ProcessPlanilhaQueue;

  
  const handleCompleted = async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId)
    if (job.returnvalue.error) {
      res.status(400).json(job.returnvalue)
    } else {
      res.status(200).json(job.returnvalue)
    }
    // Remove o manipulador de eventos após o uso para garantir que ele não seja executado novamente
    queueEvents.removeListener('completed', handleCompleted)
  };

  // Adicionar o manipulador de eventos
  queueEvents.on('completed', handleCompleted);
});


router.post('/get-consolidado',
     async(req, res) => {

       console.log(req.body) 

       const body = {
        inicio: req.body.inicio,
        fim: req.body.fim,
        total: req.body.total,
        consulta: req.body.consulta,
        id: req.body.id,
        EspecialidadeMedica: req.body.EspecialidadeMedica,
        CPFsPacientes: req.body.CPFsPacientes
      }
     
        await ProcessConsolidadoQueue.add('ProcessConsolidado', {
          body
        })
        
        const queueEvents = new QueueEvents('ProcessConsolidado', { connection: redisRead })
        const queue = ProcessConsolidadoQueue

        const handleCompleted = async ({ jobId }) => {
          const job = await Job.fromId(queue, jobId)

          if (job.returnvalue.error) {
            res.status(400).json(job.returnvalue)
          } else {
            res.status(200).json(job.returnvalue)
          }
          // Remove o manipulador de eventos após o uso para garantir que ele não seja executado novamente
          queueEvents.removeListener('completed', handleCompleted)
        };
      
        // Adiciona o manipulador de eventos
        queueEvents.on('completed', handleCompleted);

     }
)


router.post('/notification-doctors-and-patients', 
     async (req,res) => {
      const body = {
        CPFPacientes: req.body.CPFPacientes,
        IDSMedicos: req.body.IDSMedicos,
        NomeUnidade: req.body.NomeUnidade,
        QuantidadeMedicosDisponiveis: req.body.QuantidadeMedicosDisponiveis,
        IDUnidade: req.body.IDUnidade,
        Solicitante: req.body.Solicitante,
        Casos: req.body.Casos,
        Status: req.body.Status,
        DataInicioConsolidado: req.body.DataInicioConsolidado,
        DataFimConsolidado: req.body.DataFimConsolidado,
        PacientesQueSuportamos: req.body.PacientesQueSuportamos,
        NomeUnidade: req.body.NomeUnidade 
      }

      SavedConsultaUnidadeSaude(body, res)
      console.log(req.body)
     }
)

router.post('/accept-medical',
       async(req, res) => {
        const { id, newState } = req.body 
        AcceptMedical(id, newState, res)
        console.log(req.body)
       }
)

router.post('/reject-medical',
       async(req, res) => {
        const { id, newState } = req.body 
        RejectMedical(id, newState, res)
        console.log(req.body)
       }
)


router.post('/warning-doctor-not-schedules',
       async(req, res) => {
        const {idMedicoWarningDoctorNotHorarios, NomePacienteWarningDoctorNotHorarios } = req.body 
        WarningDoctorNotSchedules(idMedicoWarningDoctorNotHorarios, NomePacienteWarningDoctorNotHorarios, res)
        console.log(req.body)
       }
)


router.post('/warning-doctor-horarios-antigos',
       async(req, res) => {
        const { NomePacienteWarningDoctorHorariosAntigos, idMedicoWarningDoctorHorariosAntigos } = req.body 
        WarningDoctorHorariosAntigos(NomePacienteWarningDoctorHorariosAntigos, idMedicoWarningDoctorHorariosAntigos, res)
        console.log(req.body)
       }
)

export default router