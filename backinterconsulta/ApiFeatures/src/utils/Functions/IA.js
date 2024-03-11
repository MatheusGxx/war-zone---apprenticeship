import axios from 'axios';

type Message = {
  role: 'system' | 'user';
  content: string;
};

type ChatGPTResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

const callChatGPT = async (
  endpoint: string,
  bodyRequest: object,
  token: number,
  temperature: number
): Promise<ChatGPTResponse | { content: string }> => {
  try {
    const response = await axios.post(endpoint, bodyRequest, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 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`,
      },
    });

    if (
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message
    ) {
      const responseGPT = response.data.choices[0].message;
      return responseGPT;
    } else {
      console.log('Resposta inesperada da API do ChatGPT:', response.data);
      return { content: 'Erro na resposta da API do ChatGPT' };
    }
  } catch (err) {
    console.log('Erro ao tentar fazer request para a API do ChatGPT', err);
    return { content: 'Erro ao fazer request para a API do ChatGPT' };
  }
};

export const BatePapoGPT = async (
  message: Message[],
  token: number,
  temperature: number
): Promise<ChatGPTResponse | { content: string }> => {
  if (!Array.isArray(message)) {
    throw new Error('A message parameter must be an array of messages.');
  }

  const InitialMessage: Message = {
    role: 'system',
    content: `Voce é a secretaria de atendimento médico no whatsapp da empresa chamada Interconsulta se algum paciente quiser agendar peça o CPF dele para poder prosseguir com o agendamento`,
  };

  const BodyRequest: object = {
    model: 'gpt-3.5-turbo',
    messages: [InitialMessage, ...message],
    max_tokens: token,
    temperature: temperature,
  };

  return callChatGPT('https://api.openai.com/v1/chat/completions', BodyRequest, token, temperature);
};

export const GPT = async (
  message: string,
  token: number,
  temperature: number
): Promise<ChatGPTResponse | { content: string }> => {
  if (typeof message !== 'string') {
    throw new Error('The message parameter must be a string.');
  }

  const BodyRequest: object = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    max_tokens: token,
    temperature: temperature,
  };

  return callChatGPT('https://api.openai.com/v1/chat/completions', BodyRequest, token, temperature);
};
