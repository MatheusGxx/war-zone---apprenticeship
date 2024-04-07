'use client'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { config } from '../config'

export const useConversionViewContent = (pathname) => {
  const [load, setLoad] = useState(false)

  const ConversionViewContent = async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/warning-fb-conversion`, { typeConversion: 'View Content', pathname });
    return response.data
  }

  useEffect(() => {
    setLoad(true)
    if(load){
      ConversionViewContent();
    }
  }, [pathname, load])

  return ConversionViewContent
}
