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

export const ComponentDrawerUnidade = ({ Navigation, Loggout, Image, NomeUnidade }) => {
  NomeUnidade = typeof NomeUnidade === 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : NomeUnidade
  if (NomeUnidade === null) {
    NomeUnidade = 'Unknown'
  }

  return (
    <>
      <List>
        <ListItemButton key="profile" onClick={() => Navigation('/profile')}>
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
                <div className='flex justify-center items-center'>
                  <AccountCircleIcon color="primary" className='cursor-pointer' fontSize='large' />
                </div>
              }
            </ListItemIcon>
            <div className="flex justify-center items-center">
              <ListItemText sx={{ color: 'blue', fontWeight: 'bold' }}>{NomeUnidade}</ListItemText>
            </div>
          </div>
        </ListItemButton>

        <ListItemButton key="agenda" onClick={() => Navigation('/agenda')}>
          <ListItemIcon>
            <EventAvailableIcon color='primary' />
          </ListItemIcon>
          <ListItemText>Agenda</ListItemText>
        </ListItemButton>
      </List>

      <Divider />

      <List>
        <ListItemButton key="logout" type="button" onClick={() => Loggout('/welcome/login-unidade')}>
          <ListItemIcon>
            <ExitToAppIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </ListItemButton>
      </List>
    </>
  )
}

ComponentDrawerUnidade.defaultProps = {
  Navigation: () => {},
  Loggout: () => {},
  Image: null,
  NomeUnidade: null,
}
