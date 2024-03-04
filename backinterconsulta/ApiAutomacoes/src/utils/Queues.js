// app.js
import { Worker, Queue } from 'bullmq';
import config from './RedisConnection.js'
import { 
     sendEmail, 
     sendDocumentsinEmail,
     BulkMessageEmailPatientPublic,
     BulkMessageEmailPatientPublicConfirmation,
     BulkMessageEmailDoctorPublicConfirmation,
 } from './Functions/AutomaticEmail.js'
import { 
     EnviarMensagem,
     SendDocumentsWhatsapp, 
     BulkMessageWhatsappPatientPublic,
     BulkMessageWhatsappPatientConfirmation,
     BulkMessageWhatsappDoctorConfirmation
 } from './Functions/Whatsapp.js'
import { ResumoCasoClinico } from './Functions/ResumoCasoClinico.js'
import { ProcessPlanilha } from './ProcessPlanilha.js'
import { ProcessCosolidado } from './ProcessConsolidado.js'

const { redis } = config

export const ResumoQueue  = new Queue('Resumo', { connection: redis })
export const WhatsappQueue = new Queue('Whatsapp', {connection: redis })
export const EmailQueue = new Queue('Email', { connection: redis })
export const SendDocumentsQueue = new Queue('Envio de Documentos', { connection: redis })
export const ProcessPlanilhaQueue = new Queue('ProcessPlanilha', { connection: redis})
export const ProcessConsolidadoQueue = new Queue('ProcessConsolidado', { connection: redis })
export const BulkMessageQueueWarn = new Queue('BulkMessageWarn', { connection: redis })
export const BulkMessageQueueConfirmation = new Queue('BulkMessageNotification', { connection: redis })

const workerWhatsapp = new Worker('Whatsapp', async job => {
   try{
    const { numero, mensagem } = job.data
      EnviarMensagem(numero, mensagem)
      console.log(job.data)
   }catch(error){
     console.error('Erro ao processar o Worker de Whatsapp', error)
   }
}, { connection: redis })

const workerEmail = new Worker('Email', async job => {
    try {
        const { to, subject, message } = job.data;
        sendEmail(to, subject, message)
        console.log(job.data)
    } catch (error) {
        console.error('Erro ao processar o Worker do Email:', error);
    }
}, { connection: redis })

const workerResumo = new Worker('Resumo', async job => {

    try{
        const {
         Diagnostico,
         Tratamento,
         FerramentasTerapeuticas,
         Progresso,
         SolicitacaoMateriais,
         RecomendacoesFuturas,
         EstadoPaciente,
         ReceitaSimples,
         ReceitaControlada,
         Atestado,
         Exame,
         result
        } = job.data

        ResumoCasoClinico(
        Diagnostico, 
        Tratamento, 
        FerramentasTerapeuticas,
        Progresso,
        SolicitacaoMateriais,
        RecomendacoesFuturas,
        EstadoPaciente,
        ReceitaSimples,
        ReceitaControlada,
        Atestado,
        Exame,
        result
        )
    
     
     console.log(job.data)
    }catch(error){
        console.error('Erro ao processar o Worker do Resumo')
    }
}, { connection: redis } )

const WorkerSendDocument = new Worker('Envio de Documentos', async job => {
    const {
        PathsFiles,
        NumberPatient,
        MensagemPaciente,
        EmailPatient,
       } = job.data
   
        sendDocumentsinEmail(EmailPatient,MensagemPaciente, PathsFiles)
        SendDocumentsWhatsapp(NumberPatient, PathsFiles, MensagemPaciente)
       console.log(job.data)

}, { connection: redis } )

const WorkerProcessPlanilha = new Worker('ProcessPlanilha', async job => {
    const  {
        body,
        params, 
        PathPlanilha, 
        Filename
       } = job.data

      const ProcessamentoP = await ProcessPlanilha(body,params,PathPlanilha,Filename)
      console.log(job.data)

      return ProcessamentoP

}, { connection: redis } )

const WorkerProcessConsolidado = new Worker('ProcessConsolidado', async job => {
    const  {
        body
       } = job.data

       const consolidado = await ProcessCosolidado(body)

       console.log(job.data)

       return consolidado

}, { connection: redis } )

const WorkerBulkMessageWarn = new Worker('BulkMessageWarn', async job => {
    const  {
        DataPatients,
        NomeUnidade
       } = job.data

    await Promise.all([
        BulkMessageWhatsappPatientPublic(DataPatients, NomeUnidade),
        BulkMessageEmailPatientPublic(DataPatients, NomeUnidade)
    ]);

    console.log(job.data);
}, { connection: redis })

const WorkerBulkMessageConfirmation = new Worker('BulkMessageNotification', async job => {
    const  {
        consultas,
        NomeUnidade,
        EndereçoUnidade
       } = job.data
         
       await Promise.all([
        BulkMessageEmailPatientPublicConfirmation(consultas, NomeUnidade, EndereçoUnidade),
        BulkMessageWhatsappPatientConfirmation(consultas, NomeUnidade, EndereçoUnidade),
         //BulkMessageEmailDoctorPublicConfirmation(body),
        //BulkMessageWhatsappDoctorConfirmation(body)
       ])
    

    console.log(job.data)

}, { connection: redis })

export default {
     workerWhatsapp, 
     workerEmail, 
     workerResumo, 
     WorkerSendDocument, 
     WorkerProcessPlanilha, 
     WorkerProcessConsolidado, 
     WorkerBulkMessageWarn,
     WorkerBulkMessageConfirmation,
}