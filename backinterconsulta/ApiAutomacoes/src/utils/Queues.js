// app.js
import { Worker, Queue } from 'bullmq';
import config from './RedisConnection.js'
import { sendEmail } from './Functions/AutomaticEmail.js'
import { EnviarMensagem } from './Functions/Whatsapp.js'
import { ResumoCasoClinico } from './Functions/ResumoCasoClinico.js';

const { redis } = config

export const ResumoQueue  = new Queue('Resumo', { connection: redis })
export const WhatsappQueue = new Queue('Whatsapp', {connection: redis })
export const EmailQueue = new Queue('Email', { connection: redis })

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
         SolicitacaoExames,
         RecomendacoesFuturas,
         EstadoPaciente,
         result
        } = job.data

        ResumoCasoClinico(
        Diagnostico, 
        Tratamento, 
        FerramentasTerapeuticas,
        Progresso,
        SolicitacaoMateriais,
        SolicitacaoExames,
        RecomendacoesFuturas,
        EstadoPaciente,
        result
        )
    
     
     console.log(job.data)
    }catch(error){
        console.error('Erro ao processar o Worker do Resumo')
    }
}, {connection: redis } )

export default { workerWhatsapp, workerEmail, workerResumo }