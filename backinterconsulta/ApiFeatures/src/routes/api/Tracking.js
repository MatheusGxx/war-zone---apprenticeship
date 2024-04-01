import {
     TrackingUTMAQ,
     TrackingUTMCS, 
     WarningFacebookConversion,
     CreateCustomAudience
} from '../../services/TrackingService.js'

import { Router } from 'express'

const router = Router()

router.post('/tracking-utm-aq',
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

        TrackingUTMAQ(
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
            UTM_Content,
            res
         )

        console.log(req.body)
       }
)

router.post('/tracking-utm-cs',
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
    
            TrackingUTMCS(
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
                UTM_Content,
                res
             )
             console.log(req.body)
     }   
)


router.post('/warning-fb-conversion',
       async(req, res) => {
        
        WarningFacebookConversion(req,res)
        console.log(req.body)
       }
)

router.post('/create-custom-audience',
        async(req, res) => {

         CreateCustomAudience(res)
         console.log(req.body)
        }
)



export default router

