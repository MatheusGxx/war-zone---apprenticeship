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

      req.idDoctor = id;

       await models.ModelRegisterMédico.findByIdAndUpdate(
        id,
        {
          $set: { 'SafeID.element.link': url }, 
        },
        { new: true } 
      );
     
      return res.json({ url })
})  

router.get('/get-code-safeid', 
   async (req, res) => {

    const { idDoctor } = req
    console.log(`ID do Médico passado pelo Endpoint authorize: ${idDoctor}`)
    const { code, state, error } = req.query
    console.log(code)

    const Medico = await models.ModelRegisterMédico.findById(idDoctor)

    Medico.SafeID[Medico.SafeID.length - 1].code = code

    Medico.save()

    const data = generateToken(code, verifier)
    console.log(data)
  
})


export default router
