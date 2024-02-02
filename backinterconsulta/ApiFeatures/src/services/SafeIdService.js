import axios from 'axios'
//RFC 7636 PKCE
//Muito código aqui em cima, tem que mudar isso aqui depois.
import { randomBytes, createHash } from 'crypto'

const generateChallenge = () => {
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

export const getSafeId = async () => {
    try{
        const { challenge } = generateChallenge()
        const response = await axios.get(
            'https://pscsafeweb.safewebpss.com.br/Service/Microservice/OAuth/api/v0/oauth/authorize',
            {
            params: {
                response_type: 'code',
                client_id: 'interconsulta-izdosfco',
                redirect_uri: 'https://interconsulta.org/api/get-code-safeid',
                code_challenge: challenge,
                code_challenge_method: 'S256'
            }
            }
        )
        return response.data
    }catch(e){
     return res.status(500).json({ message: 'Erro ai pegar o HTML do safeID'})
    }
}

