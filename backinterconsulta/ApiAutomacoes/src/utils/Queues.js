// app.js
import { Worker, Queue } from 'bullmq';
import config from './RedisConnection.js'
import { sendEmail, sendDocumentsinEmail } from './Functions/AutomaticEmail.js'
import { EnviarMensagem, SendDocumentsWhatsapp } from './Functions/Whatsapp.js'
import { ResumoCasoClinico } from './Functions/ResumoCasoClinico.js';

const { redis } = config

export const ResumoQueue  = new Queue('Resumo', { connection: redis })
export const WhatsappQueue = new Queue('Whatsapp', {connection: redis })
export const EmailQueue = new Queue('Email', { connection: redis })
export const SendDocumentsQueue = new Queue('Envio de Documentos', { connection: redis })

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
        await sendEmail(to, subject, message)
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

        await ResumoCasoClinico(
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
}, {connection: redis } )

const WorkerSendDocument = new Worker('Envio de Documentos', async job => {
    const  {
        PathsFiles,
        NumberPatient,
        MensagemPaciente,
        EmailPatient,
       } = job.data
   
       await sendDocumentsinEmail(EmailPatient,MensagemPaciente, PathsFiles)
       await SendDocumentsWhatsapp(NumberPatient, PathsFiles, MensagemPaciente)
       console.log(job.data)

}, { connection: redis} )

export default { workerWhatsapp, workerEmail, workerResumo, WorkerSendDocument }