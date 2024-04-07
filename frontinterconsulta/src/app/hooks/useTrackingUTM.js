'use client'
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { UTMS } from "../utils/UTMS.js"
import secureLocalStorage from 'react-secure-storage'

export const useTrackingUTM = () => {
 const [load, setLoad] = useState(false)
 const params = useSearchParams()

 const referrer = params.get('UTM_Referrer') 
 const funil = params.get('UTM_Funil') 
 const temp = params.get('UTM_Temp')  
 const rota = params.get('UTM_Rota')
 const source = params.get('UTM_Source') 
 const medium = params.get('UTM_Medium') 
 const campaign = params.get('UTM_Campaign') 
 const term = params.get('UTM_Term') 
 const content = params.get('UTM_Content')  
  
 useEffect(() => {
    setLoad(true)
    if(load){
     if(referrer && funil && temp && rota && source && medium && campaign && term && content){
        const utms = UTMS(referrer, funil, temp, rota, source, medium, campaign, term, content);
        secureLocalStorage.setItem('utms', (utms))
      }
    }else{
      return
    }
 }, [referrer, funil, temp, rota, source, medium, campaign, term, content, load])
}