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
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { config } from '../config.js'
import { useBlood } from '../context/context.js'

export const ComponentDrawerPaciente = ({ Navigation, Loggout, Image }) =>{ 

 const NomePaciente = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false

 const nome = NomePaciente|| ''

 const { setBlood } = useBlood()

 const HandleBlood = () => {
  if(!NomePaciente){
    alert('Voce nao esta Logado')
   }else{
    setBlood(true)
   }
 }


 return(
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
                <ListItemText sx={{ color: 'blue', fontWeight: 'bold'}}>{nome}</ListItemText>
              </div>
            </div>
          </ListItemButton>

          <List>
          <ListItemButton onClick={HandleBlood}>
            <ListItemIcon>
              <BloodtypeIcon color="primary"/>
            </ListItemIcon>
            <ListItemText> Encontrar Doador </ListItemText>
          </ListItemButton>
        </List>

          <ListItemButton onClick={() => Navigation('/agenda')}>
            <ListItemIcon>
              <EventAvailableIcon color='primary' />
            </ListItemIcon>
            <ListItemText> Agenda </ListItemText>
          </ListItemButton>
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={() => Loggout('/welcome/login-paciente')}>
            <ListItemIcon>
              <ExitToAppIcon color="primary" />
            </ListItemIcon>
            <ListItemText> Sair </ListItemText>
          </ListItemButton>
        </List>
  </>
 )
}