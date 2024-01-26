import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Logo from '../public/logo.png'
import DownloadingIcon from '@mui/icons-material/Downloading';
import { config } from '../config.js'

const Baixar = () =>{
  const[download, setDownload] = useState('')

  async function fetchDownload() {
    try {
      const response = await axios.get(`http://${config.apiBaseUrl}/api/get-planilha`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      return window.URL.createObjectURL(blob)
    } catch (error) {
      throw new Error('Erro ao fazer o download da planilha');
    }
  }

  const queryKey = ['Download', download]
  const { isLoading, data } = useQuery(queryKey, ()  => fetchDownload(download))

  const handleDownload = () => {
    if (data) {
      const a = document.createElement('a');
      a.href = data
      a.download = 'ModelPlanilhaInterconsulta.xlsx';
      a.click();
      window.URL.revokeObjectURL(data)
    }
  }

  if (isLoading) {
    <Image src={Logo} alt="Logo Interconsulta" width={50} height={50} className='animate-pulse' />
  }
  return(
    <>
       <button
        className='w-36 h-10 bg-red-600 rounded-full font-bold text-white sm:w-36 sm:h-8'
        onClick={handleDownload}>
        <div className="flex justify-center items-center gap-3">
          <p>Baixar</p>
          <DownloadingIcon/>
        </div>
       </button>
    </>
  )
}

export default Baixar;
