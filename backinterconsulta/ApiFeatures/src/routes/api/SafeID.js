import { Router } from 'express'
import { generateChallenge, getSafeId } from '../../services/SafeIdService.js'
import { models } from '../../../MongoDB/Schemas/Schemas.js'

const router = Router()
const { verifier, challenge } = generateChallenge(); //Temporario

router.get('/authorize-safeid/:id',
    async (req, res) => {
      const url = await getSafeId(challenge) //TODO: coletar o challenge e o verifier do banco de dados
      console.log(url)

      const { id } = req.params

      const savedUrl = await models.ModelRegisterMédico.findByIdAndUpdate(
        id,
        {
          $set: { 'SafeID.0.link': url }, 
        },
        { new: true } 
      )
      console.log(savedUrl)
     
      return res.json({ url });
})

router.get('/get-code-safeid', 
   async (req, res) => {
    const { code, state, error } = req.query
    console.log(code)
})

router.post('/')

export default router
