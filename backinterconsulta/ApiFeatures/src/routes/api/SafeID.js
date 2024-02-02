import { Router } from 'express'
import { 
   generateChallenge,
   getSafeId, 
   generateToken
} from '../../services/SafeIdService.js'
import { models } from '../../../MongoDB/Schemas/Schemas.js'

const router = Router()
const { verifier, challenge } = generateChallenge(); 

router.get('/authorize-safeid/:id',
    async (req, res) => {
      const url = await getSafeId(challenge)
    
      const { id } = req.params

      const savedURL = new models.SafeID({
            url: url,
            idDoctor: id,
      })
      console.log(`Salvando url e ID do médico no banco de dados: ${savedURL}`)

      await savedURL.save()

      return res.json({ url })
})  

  router.get('/get-code-safeid', 
    async (req, res) => {

      try{
        const { code, state, error } = req.query
        console.log(code)

        const lastSavedURL = await models.SafeID.findOne().sort({ _id: -1 });
        console.log(`Salvando code no banco de dados: ${lastSavedURL}`)

        if (!lastSavedURL) {
          return res.status(404).json({ message: 'Nenhum SafeID encontrado' });
        }

        lastSavedURL.SafeID.push({
          link: lastSavedURL.url,
          idDoctor: lastSavedURL.idDoctor,
          code: code,
          token: null,  // Você pode definir o token como null inicialmente, se necessário
          idSignature: null  // Defina como null ou forneça um valor inicial, se necessário
        });

        await lastSavedURL.save()

        const data = generateToken(code, verifier, res)
        console.log(`Token de acesso: ${data}`)
      }catch(error){
        return res.status(200).json({ message: 'Erro ao receber code da api do SafeID'})
      }  
  })


export default router
