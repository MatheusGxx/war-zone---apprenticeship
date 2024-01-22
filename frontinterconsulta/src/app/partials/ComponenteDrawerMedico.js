import {
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
  Divider,
} from '@mui/material'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import secureLocalStorage from 'react-secure-storage'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export const ComponentDrawerMédico = ({ Navigation, Loggout, Image }) =>{ 

 const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false

 const id = idLocal || ''

 const nomeMedico = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeMedico') : false

 const nome = nomeMedico || ''

 useEffect(() => {
  getSlug.mutateAsync()
  },[])

  const getSlug = useMutation(async() =>{
  const request = await axios.post(`http://localhost:8080/api/get-slug/${id}`)
  return request.data.SlugMedico
  })

 return(
  <>
    <List>
          <ListItemButton>
            <div className='flex gap-10'>
              <ListItemIcon>
                <Avatar style={{ width: 60, height: 60 }}>
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
                </Avatar>
              </ListItemIcon>
              <div className="flex justify-center items-center">
                <ListItemText sx={{ color: 'blue', fontWeight: 'bold'}}>{nome}</ListItemText>
              </div>
            </div>
          </ListItemButton>


          <ListItemButton onClick={() => Navigation(`/especialista/${getSlug.isSuccess && getSlug.data}`)}>
            <ListItemIcon>
            <AccountCircleIcon color="primary"/>
            </ListItemIcon>
            <ListItemText> Perfil </ListItemText>
          </ListItemButton>

          <ListItemButton onClick={() => Navigation('/casos-clinicos')}>
            <ListItemIcon>
              <AccessTimeIcon color="primary" />
            </ListItemIcon>
            <ListItemText> Seus Horarios </ListItemText>
          </ListItemButton>

          <ListItemButton onClick={() => Navigation('/agenda')}>
            <ListItemIcon>
              <EventAvailableIcon color='primary' />
            </ListItemIcon>
            <ListItemText> Agenda </ListItemText>
          </ListItemButton>
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={() => Loggout('/welcome/login-medico')}>
            <ListItemIcon>
              <ExitToAppIcon color="primary" />
            </ListItemIcon>
            <ListItemText> Sair </ListItemText>
          </ListItemButton>
        </List>
  </>
 )
}