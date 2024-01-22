import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import secureLocalStorage from 'react-secure-storage'
import { usePathname } from 'next/navigation'


export const DrawerComponent = ({ open, Close, Navigation}) =>{

  const Route = usePathname()
    
  const RotaMédico = Route === '/casos-clinicos';

  const RotaPaciente = Route === '/especialistas-disponiveis'

  const RotaUnidade = Route ===  '/unidade-especialista'

  const Agenda = Route === '/agenda'

  const Médico = secureLocalStorage.getItem('NomeMedico')
  const Paciente = secureLocalStorage.getItem('NomePaciente')
  const Unidade = secureLocalStorage.getItem('NomeUnidade')

  return(
    <>
       <Drawer anchor="top" open={open} onClose={Close}>
        {RotaMédico && 
        <List>
           <ListItemButton onClick={() => Navigation('/casos-clinicos')}>
                  <ListItemText> Casos Clinicos </ListItemText>
           </ListItemButton>

           <ListItemButton onClick={() => Navigation('/agenda')}>
                  <ListItemText> Agenda </ListItemText>
           </ListItemButton>
        </List>
        }

        {RotaPaciente && 
                <List>
                  <ListItemButton onClick={() => Navigation('/especialistas-disponiveis')}>
                          <ListItemText> Especialistas Disponiveis </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => Navigation('/unidade-especialista')}>
                          <ListItemText> Inter Gestão </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => Navigation('/agenda')}>
                          <ListItemText> Agenda </ListItemText>
                  </ListItemButton>
                </List>
        }

        {RotaUnidade && 
                <List>

                   <ListItemButton onClick={() => Navigation('/unidade-especialista')}>
                                <ListItemText> Inter Gestão </ListItemText>
                      </ListItemButton>

                   <ListItemButton onClick={() => Navigation('/especialistas-disponiveis')}>
                           <ListItemText> Especialistas Disponiveis </ListItemText>
                    </ListItemButton>

                     <ListItemButton onClick={() => Navigation('/agenda')}>
                              <ListItemText> Agenda </ListItemText>
                     </ListItemButton>
                 </List>
        }

        {Agenda && Médico &&
         <List>
         <ListItemButton onClick={() => Navigation('/casos-clinicos')}>
                <ListItemText> Casos Clinicos </ListItemText>
         </ListItemButton>

         <ListItemButton onClick={() => Navigation('/agenda')}>
                <ListItemText> Agenda </ListItemText>
         </ListItemButton>
      </List>
        }
        
        {Agenda && Paciente && 
            <List>
                  <ListItemButton onClick={() => Navigation('/especialistas-disponiveis')}>
                          <ListItemText> Especialistas Disponiveis </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => Navigation('/unidade-especialista')}>
                          <ListItemText> Inter Gestão </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => Navigation('/agenda')}>
                          <ListItemText> Agenda </ListItemText>
                  </ListItemButton>
                </List>
        }
        {Agenda && Unidade &&
         <List>

                   <ListItemButton onClick={() => Navigation('/unidade-especialista')}>
                                <ListItemText> Inter Gestão </ListItemText>
                      </ListItemButton>

                   <ListItemButton onClick={() => Navigation('/especialistas-disponiveis')}>
                           <ListItemText> Especialistas Disponiveis </ListItemText>
                    </ListItemButton>

                     <ListItemButton onClick={() => Navigation('/agenda')}>
                              <ListItemText> Agenda </ListItemText>
                     </ListItemButton>
                 </List>
        }

        {Agenda && Unidade === null && Médico === null && Paciente === null &&
           <List>
            <ListItemButton onClick={() => Navigation('/welcome')}>
               <ListItemText> Login </ListItemText>
           </ListItemButton> 
          </List>
        }
        </Drawer>
    </>
  )
}