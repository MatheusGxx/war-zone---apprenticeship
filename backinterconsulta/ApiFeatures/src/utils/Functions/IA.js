import axios from 'axios'

export const BatePapoGPT = async (message, token, temperature, patientInfo) => {
  const endPoint = 'https://api.openai.com/v1/chat/completions';
  const Key = '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'

  const InitialMessage = `Voce é a secretaria de atendimento médico no whatsapp da empresa chamada Interconsulta se algum paciente quiser agendar peça o CPF dele para poder prosseguir com o agendamento`

  const BodyRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: InitialMessage,
      },
      ...message,
      {
        role: 'user',
        content: JSON.stringify(patientInfo),
      },
    ],
    max_tokens: token,
    temperature: temperature,
  };

  try {
    const response = await axios.post(endPoint, BodyRequest, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Key}`,
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
}

//--------------------------------------------------------------------------------------------------------------------------//
export const GPT = async (message, token, temperature) => {
  const endPoint = 'https://api.openai.com/v1/chat/completions';
  const Key = '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'

  const BodyRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: message
      },
    ],
    max_tokens: token,
    temperature: temperature,
  };

  try {
    const response = await axios.post(endPoint, BodyRequest, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Key}`,
      },
    })

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
