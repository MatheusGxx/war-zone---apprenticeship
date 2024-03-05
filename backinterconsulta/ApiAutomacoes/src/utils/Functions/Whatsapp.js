import venom from 'venom-bot'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { promisify } from 'util'
import { readFileSync, writeFileSync } from 'fs'
import fs from 'fs'
import { models } from '../../../MongoDB/Schemas/Schemas.js'

const readFileAsync = promisify(fs.readFile)

let client

export const CreateInstance = async () => {
  try {
    if (!client) {
      client = await venom.create({
        session: 'Interconsulta',
      }).catch((error) => {
        console.log('Erro ao Iniciar o Venom', error);
      });
    }
  } catch (error) {
    console.log('Erro ao Iniciar a Instancia do Venom', error);
  }
};


export const getClient = () => {
  return client
};

export const EnviarMensagem = async (numero, mensagem) => {
  try {
      const Mensagem = await client.sendText(`${numero}@c.us`, mensagem);
      console.log(`Mensagem no WhatsApp enviada para: ${numero}, Texto Enviado: ${Mensagem.text}, Status do Erro: ${Mensagem.erro}`);
  } catch (error) {
    console.log('Erro ao enviar Mensagem para o Usuario', error);
  }
}

export const BulkMessageWhatsappPatientPublic = async (dataPatients, NomeUnidade) => {
  try {

    if(client){
      console.log('Instancia do Venom ja esta Criada')
    }else{
      client = await venom.create({
        session: 'Interconsulta',
      }).catch((error) => {
        console.log('Erro ao Iniciar o Venom', error);
      });
    }
    const delay = 1000
    
    await Promise.all(
      dataPatients.map(async (data, index) => {
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const Message = `${data.NomePaciente},\n\n🌷 A Secretaria de Saúde ${NomeUnidade} tem uma novidade especial para você! Estamos em busca de um especialista em ${data.Especialidade} para cuidar do seu bem-estar com todo carinho. 🩹`
              const result = await client.sendText(`${data.Telefone}@c.us`, Message);
              console.log(`Paciente: ${data.NomePaciente}, Notificado com Sucesso\nMensagem Enviada: ${result.text}`);
            } catch (error) {
              console.error(`Erro ao enviar mensagem para ${data.NomePaciente}: `, error);
            }
            resolve();
          }, index * delay)
        });
      })
    )

  } catch (error) {
    console.log('Erro ao enviar mensagem em massa para os Medicos ', error)
  }
}

export const BulkMessageWhatsappPatientConfirmation = async (consultas, NomeUnidade, EndereçoUnidade) => {

  if(client){
    console.log('Instancia do Venom ja esta Criada')
  }else{
    client = await venom.create({
      session: 'Interconsulta',
    }).catch((error) => {
      console.log('Erro ao Iniciar o Venom', error);
    });
  }

 const delay = 1000
    
 await Promise.all(
   consultas.map(async (data, index) => {
     await new Promise((resolve) => {
       setTimeout(async () => {
         try {
          const Message = `🌟 Olá ${data.Solicitante}!\n\nA Secretaria de Saúde ${NomeUnidade} do município tem uma notícia especial para você! Sua consulta está agendada com ${data.Solicitado}, especialista em ${data.EspecialidadeSolicitado}, no dia ${data.Data} às ${data.Inicio}. Sua presença é fundamental! Estamos trabalhando arduamente para atender a todos os cidadãos. Seja consciente, não falte, ou se necessário, cancele com antecedência. Lembre-se, outros pacientes também aguardam por atendimento. 🌷\n\nEntre Nesse Link abaixo agora para confirmar a sua consulta:\n\nhttps://interconsulta.org/accept-medical?response=${encodeURIComponent(data.NomeUnidadeSolicitante)}&namePatient=${encodeURIComponent(data.Solicitante)}&date=${encodeURIComponent(data.Data)}&start=${encodeURIComponent(data.Inicio)}&upload=${encodeURIComponent(data.FotoUnidadeSolicitante)}&id=${encodeURIComponent(data._id)}`;
          const result = await client.sendText(`${data.NumeroSolicitante}@c.us`, Message);
           console.log(`Paciente: ${data.Solicitante}, Notificado com Sucesso\nMensagem Enviada: ${result.text}`);
         } catch (error) {
           console.error(`Erro ao enviar mensagem para ${data.Solicitante}: `, error);
         }
         resolve();
       }, index * delay)
     });
   })
 )
}


export const BulkMessageWhatsappDoctorConfirmation = async(body) => {
  const { IDSMedicos, NomeUnidade, } = body
  
  if(client){
    console.log('Instancia do Venom ja esta Criada')
  }else{
    client = await venom.create({
      session: 'Interconsulta',
    }).catch((error) => {
      console.log('Erro ao Iniciar o Venom', error);
    });
  }
  
  const getDoctors = await models.ModelRegisterMédico.find({ _id: { $in: IDSMedicos }})

  const DataDoctors = getDoctors.map((data) => ({
   Telefone: data.telefone,
   NomeEspecialista: data.NomeEspecialista
 }))

 const delay = 1000
    
 await Promise.all(
   DataDoctors.map(async (data, index) => {
     await new Promise((resolve) => {
       setTimeout(async () => {
         try {
           const Message = `${NomeUnidade} Informa: ${data.NomeEspecialista} tem paciente novo na sua agenda!`
           const result = await client.sendText(`${data.Telefone}@c.us`, Message);
           console.log(`Médico: ${data.NomeEspecialista}, Notificado com Sucesso\nMensagem Enviada: ${result.text}`);
         } catch (error) {
           console.error(`Erro ao enviar mensagem para ${data.NomeEspecialista}: `, error);
         }
         resolve();
       }, index * delay)
     });
   })
 )

}

export const SendDocumentsWhatsapp = async (numeroPaciente, filesPath, MensagemPaciente) => {
  try {
    
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDir = dirname(currentFilePath)
    const path = join(currentDir, '../../..', 'node_modules/venom-bot/dist/lib/wapi', 'wapi.js')
    
    let toFix = readFileSync(path);
    toFix = toFix.toString().replace(
      `return await n.processAttachments("0.4.613"===Debug.VERSION?t:t.map((e=>({file:e}))),e,1),n}`,
      `return await n.processAttachments("0.4.613"===Debug.VERSION?t:t.map((e=>({file:e}))),e,e),n}`
    )

    writeFileSync(path, toFix)

   await client.sendText(`${numeroPaciente}@c.us`, MensagemPaciente)
  
   const promises = filesPath.map(async (data) => {
     const getPaths = join(currentDir, '../../..', data)
     const sendDocuments = await client.sendFile(`${numeroPaciente}@c.us`, getPaths, `${data.split('/').pop()}`, `Documento`)
     console.log(`Documento Enviado para o Paciente do Numero: ${numeroPaciente}`)
     return sendDocuments;
   })
   
   await Promise.all(promises)
   
   console.log(`Todos os documentos foram enviados para o paciente do número: ${numeroPaciente}`)
  } catch(error) {
   console.error('Erro ao enviar documentos:', error);
  }
}

/*export const SecretariaIA = async (client) => {
  const chatHistories = {};

  client.onMessage(async (message) => {
    if (message.body && message.isGroupMsg === false) {
      try {
        const phoneNumber = message.from;
        const Message = `${message.body}`;
        let patient = null; // Inicializa patient como null

        // Verifica se a mensagem contém um CPF
        const cpfRegex = /\d{3}(\.?\d{3}){2}-?\d{2}/;
        const match = Message.match(cpfRegex);

        if (match) {
          const cpf = match[0].replace(/\D/g, ''); // Remove caracteres não numéricos

          // Busca as informações do paciente no banco de dados
          patient = await SavedPaciente(cpf);

          if (patient) {
            // Faça o que desejar com as informações do paciente, por exemplo, agendar uma consulta
            console.log('Informações do paciente:', patient);
          } else {
            console.log('Paciente não encontrado no banco de dados.')

            if (!chatHistories[phoneNumber]) {
              chatHistories[phoneNumber] = []
            }

            // Adiciona uma mensagem indicando que o paciente não está cadastrado e sugere o cadastro
            chatHistories[phoneNumber].push({
              role: 'assistant',
              content: 'Vi que voce nao tem um cadastrado no Interconsulta se quiser se cadastrar  entre no link  www.interconsulta.com/welcome/login-paciente/cadastro-paciente mas continuando qual é a especialidade e data que voce deseja marcar a sua consulta?',
            });

            await client.sendText(message.from, `Vi que voce nao tem um cadastrado no Interconsulta se quiser se cadastrar  entre no link  www.interconsulta.com/welcome/login-paciente/cadastro-paciente mas continuando qual é a especialidade e data que voce deseja marcar a sua consulta?`);

            chatHistories[phoneNumber].push({
              role: 'assistant',
              content: ResponseIA.content,
            });

            // Envia a resposta ao usuário
            await client.sendText(message.from, ResponseIA.content);
            console.log(`Histórico para ${phoneNumber}:`, chatHistories[phoneNumber]);

            return; // Encerra a execução da função após a resposta do ChatGPT
          }
        }

        // Inicializa o histórico de chat se ainda não existir
        if (!chatHistories[phoneNumber]) {
          chatHistories[phoneNumber] = [];
        }

        // Adiciona a mensagem ao histórico
        chatHistories[phoneNumber].push({
          role: 'user',
          content: Message,
        });

        // Chama a função GPT com o histórico de mensagens específico para este número de telefone
        const ResponseIA = await BatePapoGPT(chatHistories[phoneNumber], 250, 0.3, patient);

        chatHistories[phoneNumber].push({
          role: 'assistant',
          content: ResponseIA.content,
        });

        // Envia a resposta ao usuário
        await client.sendText(message.from, ResponseIA.content);
        console.log(`Histórico para ${phoneNumber}:`, chatHistories[phoneNumber]);
      } catch (e) {
        console.log('Erro ao processar a mensagem do WhatsApp', e);
      }
    }
  });
}*/


// Crie uma função que envie arquivos usando venom-bot