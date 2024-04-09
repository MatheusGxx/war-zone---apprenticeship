import { Router } from 'express'
import uploadPlanilha from '../../utils/multerPlanilha.js'

const router = Router()

import {
  GetPlanilha,
  getWaitList
} from '../../services/UnidadeService.js'

router.get('/get-planilha', async(req, res) =>{

  const response = res
  GetPlanilha(response)
})


router.post('/get-wait-list', 
       async(req, res)  => {
        getWaitList(res)
        console.log(req.body)
       }
)

export default router