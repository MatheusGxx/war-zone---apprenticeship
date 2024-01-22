import venom from 'venom-bot'

let client;

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

export const BulkMassage = async (Numeros, Message, res) => {
  try {
    const delay = 1000; // 3 seconds interval

    await Promise.all(
      Numeros.map(async (data, index) => {
        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const result = await client.sendText(`${data}@c.us`, Message);
              console.log(`Numero ${data} Notificado com Sucesso\nMensagem Enviada: ${result.text}`);
            } catch (error) {
              console.error(`Erro ao enviar mensagem para ${medico}: `, error);
            }
            resolve();
          }, index * delay)
        });
      })
    );

      // Se todas as mensagens foram enviadas com sucesso, envie o status 200
      if (!res.headersSent) { // res.headersSent = ja enviamos uma resposta do servidor para o client side
        res.status(200).json({ message: 'Mensagem em Massa Enviadas' })
      }

  } catch (error) {
    console.log('Erro ao enviar mensagem em massa para os Medicos ', error);
    // Se houver um erro, envie um status de erro, por exemplo, 500
    if (!res.headersSent) {
      res.status(500).json({ message: 'Erro ao enviar mensagens em Massa'})
    }
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
