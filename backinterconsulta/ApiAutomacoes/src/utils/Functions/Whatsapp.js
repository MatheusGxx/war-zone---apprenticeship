import venom from 'venom-bot';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';
import { readFileSync, writeFileSync } from 'fs';
import fs from 'fs';
import { models } from '../../../MongoDB/Schemas/Schemas.js';

const readFileAsync = promisify(fs.readFile);

let client;

export const getClient = async () => {
  if (!client) {
    client = await venom.create({
      session: 'Interconsulta',
    }).catch((error) => {
      console.log('Erro ao Iniciar o Venom', error);
    });
  }
  return client;
};

export const EnviarMensagem = async (numero, mensagem) => {
  try {
    const clientInstance = await getClient();
    const Mensagem = await clientInstance.sendText(`${numero}@c.us`, mensagem);
    console.log(`Mensagem no WhatsApp enviada para: ${numero}, Texto Enviado: ${Mensagem.text}, Status do Erro: ${Mensagem.erro}`);
  } catch (error) {
    console.log('Erro ao enviar Mensagem para o Usuario', error);
  }
}

export const BulkMessageWhatsappPatientPublic = async (dataPatients, NomeUnidade) => {
  try {
    const clientInstance = await getClient();
    const delay = 1000;

    await Promise.all(
      dataPatients.map(async (data, index) => {
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const Message = `${data.NomePaciente},\n\n🌷 A Secretaria de Saúde ${NomeUnidade} tem uma novidade especial para você! Estamos em busca de um especialista em ${data.Especialidade} para cuidar do seu bem-estar com todo carinho. 🩹`;
              const result = await clientInstance.sendText(`${data.Telefone}@c.us`, Message);
              console.log(`Paciente: ${data.NomePaciente}, Notificado com Sucesso\nMensagem Enviada: ${result.text}`);
            } catch (error) {
              console.error(`Erro ao enviar mensagem para ${data.NomePaciente}: `, error);
            }
            resolve();
          }, index * delay);
        });
      })
    );

  } catch (error) {
    console.log('Erro ao enviar mensagem em massa para os Medicos ', error);
  }
}

// ... (other functions remain the same)

export const SendDocumentsWhatsapp = async (numeroPaciente, filesPath, MensagemPaciente) => {
  try {
    if (!Array.isArray(filesPath) || !filesPath.length) {
      throw new Error('Invalid filesPath');
    }

    const clientInstance = await getClient();

    await clientInstance.sendText(`${numeroPaciente}@c.us`, MensagemPaciente);

    const promises = filesPath.map(async (data) => {
      const getPaths = join(currentDir, '../../..', data);

      if (!fs.existsSync(getPaths)) {
        throw new Error(`File not found: ${getPaths}`);
      }

      const sendDocuments = await clientInstance.sendFile(`${numeroPaciente}@c.us`, getPaths, `${data.split('/').pop()}`, `Documento`);

      console.log(`Documento Enviado para o Paciente do Numero: ${numeroPaciente}`);
      return sendDocuments;
    });

    await Promise.all(promises);

    console.log(`Todos os documentos foram enviados para o paciente do número: ${numeroPaciente}`);
  } catch (error) {
    console.error('Erro ao enviar documentos:', error);
  }
}

// ... (other functions remain the same)
