import axios from 'axios'
//RFC 7636 PKCE
//Muito código aqui em cima, tem que mudar isso aqui depois.
import { randomBytes, createHash } from 'crypto'

export const generateChallenge = () => {
  const verifier = randomBytes(32)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  const challenge = createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return { verifier, challenge }
}

export const getSafeId = async (challenge) => {
    try{
      // const { verifier, challenge } = generateChallenge();
      const baseUrl = 'https://pscsafeweb.safewebpss.com.br/Service/Microservice/OAuth/api/v0/oauth/authorize';
      const params = new URLSearchParams();
      
      params.append('response_type', 'code');
      params.append('client_id', 'interconsulta-izdosfco');
      params.append('redirect_uri', 'https://interconsulta.org/api/get-code-safeid');
      params.append('code_challenge', challenge);
      params.append('code_challenge_method', 'S256');
      params.append('lifetime', '604800');  // Adjust the value if needed
      params.append('scope', 'signature_session');
      
      const completeURI = `${baseUrl}?${params.toString()}`;
      return completeURI;

    }catch(e){
     return res.status(500).json({ message: 'Erro ao entrar no link do safeID'})
    }
}

export const generateToken = async(code, verifier) => {
  try{

  }catch(error){
    return res.status(500).json({ message: 'Erro ao gerar Token do safeID'})
  }
  //!!! client_secret exposto, cuidado !!!
    const request = await axios.post("https://pscsafeweb.safewebpss.com.br/Service/Microservice/OAuth/api/v0/oauth/token", {
    client_id: 'interconsulta-izdosfco',
    client_secret: 'KEZFmcHRimCSSg2oE1nEdikWYRWplIONW7fM1RsGiqKZgBSxWyesP7K5dkPNSw8HxJdm5axsHUTtXmLxMgQ09bUhMQZcNTTjvmwQ1gLC3mPp0qCPhoGleQXXtQc6Kh2I',
    code: code,
    code_verifier: verifier,
    grant_type: 'authorization_code'
  })
  return request.data; //Retorna uma série de informações, inclusive o token.

  /* exemplo de retorno
  access_token 	string 	Valor do token de acesso <- Esse é o que a gente quer
  token_type 	string 	Valor fixo Bearer
  expires_in 	int 	Valor inteiro com validade do token em segundos. O limite para pessoas físicas é de 7 dias. Para pessoa jurídica é de 30 dias.
  scope 	string 	Deve ser informado se o escopo retornado for diferente do solicitado pela aplicação
  authorized_identification_type 	string 	Deverá conter CPF ou CNPJ
  authorized_identification 	string 	Valor correspondente ao CPF ou CNPJ associado ao titular do certificado
  */
}

export const signatureStart = async (token, pdfDocument) => {
  try {
    const base64Content = Buffer.from(pdfDocument).toString('base64');
    const response = await axios.post('https://pscsafeweb.safewebpss.com.br/Service/Microservice/OAuth/api/v0/oauth/pades-signature/start', {
      content: base64Content
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   return response.data.id;
  } catch (error) {
    console.error(error);
  }
}

export const applyStamp = async (token, signatureId) => {
  try {
    const response = await axios.post(`https://pscsafeweb.safewebpss.com.br/Service/Microservice/OAuth/api/v0/oauth/pades-signature/apply`, {
      id: signatureId,
      alias: '00000000000' //TODO: posteriormente mudar isso para um valor dinâmico
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.id;
  } catch (error) {
    console.error(error);
  }
}

/* exemplo de entrada
{
  "Id": "21a1940b61c4490499636e15f3f5c7c0",
  "signature_policy": 1,
  "alias": "00000000000",
  "annotations": [
    {
      "x": 336.261064,
      "y": 28.005527,
      "width": 155.23876,
      "height": 77.61938,
      "page": 1,
      "image": "base64 image content"
    },
    {
      "x": 200.261064,
      "y": 100.005527,
      "width": 200.23876,
      "height": 100.61938,
      "page": 2
    }
  ]
}
*/

export const signatureFinish = async(token, signatureId) => {
  try {
    const response = await axios.post(`https://pscsafeweb.safewebpss.com.br/Service/Microservice/OAuth/api/v0/oauth/pades-signature/finish`, {
      id: signatureId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; //Retorna o documento assinado, em base64
  } catch (error) {
    console.error(error);
  }
}