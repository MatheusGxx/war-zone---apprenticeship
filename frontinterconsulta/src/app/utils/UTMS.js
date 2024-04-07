import { format } from 'date-fns'

export const UTMS = (referrer, funil, temp, rota, source, medium, campaign, term, content) => {
   const currentDate = new Date()
   const formattedDate = format(currentDate, 'dd/MM/yyyy')

   const utms = {
    UTM_Referrer: referrer,
    UTM_Funil: funil,
    UTM_Temp: temp,
    UTM_Rota: rota,
    UTM_Source: source,
    UTM_Medium: medium,
    UTM_Campaign: campaign,
    UTM_Term: term,
    UTM_Content: content,
    data: formattedDate,
    id: ''
   }
   
   return utms
}