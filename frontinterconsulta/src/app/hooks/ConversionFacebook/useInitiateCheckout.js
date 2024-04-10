import { useEffect, useState } from "react"
import axios from 'axios'
import { config } from "../../config"
import { useMutation } from '@tanstack/react-query'

export const useConversionInitiateCheckout = (pathname, id) => {

    const [load, setLoad] = useState(false)
  
    const IniateCheckoutConversion = useMutation(async (value) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/warning-fb-conversion`, value)
      return response.data
    }) 
  
    useEffect(() => {
      setLoad(true)
      if(load){
        IniateCheckoutConversion.mutateAsync({typeConversion: 'Initiate Checkout', pathname, id })
      }
    }, [pathname, load])
  
    return IniateCheckoutConversion
  }
  