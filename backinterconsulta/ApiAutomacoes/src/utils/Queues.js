// app.js
import { Worker, Queue } from 'bullmq';
import { createClient } from './RedisConnection.js';
import {
  sendEmail,
  sendDocumentsinEmail,
  BulkMessageEmailPatientPublic,
  BulkMessageEmailPatientPublicConfirmation,
  BulkMessageEmailDoctorPublicConfirmation,
  EnviarMensagem,
  SendDocumentsWhatsapp,
  BulkMessageWhatsappPatientPublic,
  BulkMessageWhatsappPatientConfirmation,
  BulkMessageWhatsappDoctorConfirmation,
  ResumoCasoClinico,
  ProcessPlanilha,
  ProcessConsolidado,
} from './Functions/index.js';

const { redisRead, redisWrite } = createClient();

const ResumoQueue = new Queue('Resumo', { connection: redisRead });
const WhatsappQueue = new Queue('Whatsapp', { connection: redisRead });
const EmailQueue = new Queue('Email', { connection: redisRead });
const SendDocumentsQueue = new Queue('Envio de Documentos', { connection: redisRead });
const ProcessPlanilhaQueue = new Queue('ProcessPlanilha', { connection: redisRead });
const ProcessConsolidadoQueue = new Queue('ProcessConsolidado', { connection: redisRead });
const BulkMessageQueueWarn = new Queue('BulkMessageWarn', { connection: redisRead });
const BulkMessageQueueConfirmation = new Queue('BulkMessageNotification', { connection: redisRead });

const workerWhatsapp = new Worker('Whatsapp', async (job) => {
  try {
    const { numero, mensagem } = job.data;
    await EnviarMensagem(numero, mensagem);
    console.log(job.data);
  } catch (error) {
    console.error('Erro ao processar o Worker de Whatsapp:', error);
  }
}, { connection: redisWrite });

const workerEmail = new Worker('Email', async (job) => {
  try {
    const { to, subject, message } = job.data;
    await sendEmail(to, subject, message);
    console.log(job.data);
  } catch (error) {
    console.error('Erro ao processar o Worker do Email:', error);
  }
}, { connection: redisWrite });

const workerResumo = new Worker('Resumo', async (job) => {
  try {
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
      result,
    } = job.data;

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
    );

    console.log(job.data);
  } catch (error) {
    console.error('Erro ao processar o Worker do Resumo:', error);
  }
}, { connection: redisWrite });

const WorkerSendDocument = new Worker('Envio de Documentos', async (job) => {
  try {
    const {
      PathsFiles,
      NumberPatient,
      MensagemPaciente,
      EmailPatient,
    } = job.data;

    await sendDocumentsinEmail(EmailPatient, MensagemPaciente, PathsFiles);
    await SendDocumentsWhatsapp(NumberPatient, PathsFiles, MensagemPaciente);

    console.log(job.data);
  } catch (error) {
    console.error('Erro ao processar o Worker do Envio de Documentos:', error);
  }
});

const WorkerProcessPlanilha = new Worker('ProcessPlanilha', async (job) => {
  try {
    const {
      body,
      params,
      PathPlanilha,
      Filename,
    } = job.data;

    const ProcessamentoP = await ProcessPlanilha(body, params, PathPlanilha, Filename);

    console.log(job.data);

    return ProcessamentoP;
  } catch (error) {
    console.error('Erro ao processar o Worker do ProcessPlanilha:', error);
  }
});

const WorkerProcessConsolidado = new Worker('ProcessConsolidado', async (job) => {
  try {
    const {
      body,
    } = job.data;

    const consolidado = await ProcessConsolidado(body);

    console.log(job.data);

    return consolidado;
  } catch (error) {
    console.error('Erro ao processar o Worker do ProcessConsolidado:', error);
  }
});

const WorkerBulkMessageWarn = new Worker('BulkMessageWarn', async (job) => {
  try {
    const {
      DataPatients,
      NomeUnidade,
    } = job.data;

    await Promise.all([
      BulkMessageWhatsappPatientPublic(DataPatients, NomeUn
