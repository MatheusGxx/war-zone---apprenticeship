'use client'
import {
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
  Divider,
} from '@mui/material'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import secureLocalStorage from 'react-secure-storage'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { config } from '../config.js'
import DownloadingIcon from '@mui/icons-material/Downloading'
import Baixar from './Baixar.js'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Logo from '../public/logo.png'
import Image from 'next/image'


export const ComponentDrawerUnidade = ({ Navigation, Loggout, Image }) => {

  const[download, setDownload] = useState('')

  async function fetchDownload() {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/get-planilha`, {
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

  const NomeUnidade = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false

  return (
    <>
      <List>
        <ListItemButton>
          <div className='flex gap-10'>
            <ListItemIcon>
            {Image ? 
                 <Avatar style={{ width: 60, height: 60 }}>
                 <img
                   src={Image}
                   alt="Imagem do usuário"
                   style={{ width: '100%', height: '100%' }}
                 />
               </Avatar> :
               <>
               <div className='flex justify-center items-center'>
               <AccountCircleIcon color="primary" className='cursor-pointer' fontSize='large'/>
               </div>
               </>
              
                }
            </ListItemIcon>
            <div className="flex justify-center items-center">
              <ListItemText sx={{ color: 'blue', fontWeight: 'bold' }}>{NomeUnidade}</ListItemText>
            </div>
          </div>
        </ListItemButton>

        <ListItemButton onClick={() => Navigation('/agenda')}>
          <ListItemIcon>
            <EventAvailableIcon color='primary' />
          </ListItemIcon>
          <ListItemText>Agenda</ListItemText>
        </ListItemButton>

        <ListItemButton onClick={handleDownload}>
          <ListItemIcon>
            <DownloadingIcon color='primary' />
          </ListItemIcon>
          <ListItemText>Baixar Planilha</ListItemText>
        </ListItemButton>
      </List>

      <Divider />

      <List>
        <ListItemButton onClick={() => Loggout('/welcome/login-unidade')}>
          <ListItemIcon>
            <ExitToAppIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </ListItemButton>
      </List>
    </>
  )
}
