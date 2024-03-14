import { TrackingUTM } from '../../services/TrackingService.js'

import { Router } from 'express'

const router = Router()

router.post('/tracking-utm',
       async(req, res) => {
        const { 
            id,
            data,
            UTM_Referrer,
            UTM_Funil,
            UTM_Temp,
            UTM_Rota,
            UTM_Source,
            UTM_Medium,
            UTM_Campaign,
            UTM_Term,
            UTM_Content} = req.body

        TrackingUTM(
            id, 
            data,
            UTM_Referrer,   
            UTM_Funil,
            UTM_Temp,
            UTM_Rota,
            UTM_Source,
            UTM_Medium,
            UTM_Campaign,
            UTM_Term,
            UTM_Content)

        console.log(req.body)
       }
)



export default router