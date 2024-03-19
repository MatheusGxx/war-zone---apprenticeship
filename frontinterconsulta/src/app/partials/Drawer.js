import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import secureLocalStorage from 'react-secure-storage'
import { usePathname } from 'next/navigation'
import { config } from '../config.js'
import { useHorariosDoctor } from '../context/context'
import { useBlood } from '../context/context.js'

export const DrawerComponent = ({ open, Close, Navigation}) =>{

  const Route = usePathname()
    
  const RotaMédico = Route === '/casos-clinicos';

  const RotaPaciente = Route === '/especialistas-disponiveis'

  const RotaUnidade = Route ===  '/unidade-especialista'

  const Agenda = Route === '/agenda'

  const Médico = secureLocalStorage.getItem('NomeMedico')
  const Paciente = secureLocalStorage.getItem('NomePaciente')
  const Unidade = secureLocalStorage.getItem('NomeUnidade')

  const idMedico = secureLocalStorage.getItem('id')

  const { setHorariosDoctor } = useHorariosDoctor()
  const { setBlood } = useBlood()

    const HandleHistorico = () => {
      if(!idMedico){
        alert('Voce nao esta logado')
      }else{
        setHorariosDoctor(true)
      }
    }

    const HandleBlood = () => {
      if(!Paciente){
        alert('Voce nao esta Logado')
      }else{
        setBlood(true)
      }
    }

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

           <ListItemButton  onClick={() => HandleHistorico()}>
                  <ListItemText> Horarios </ListItemText>
           </ListItemButton>
        </List>
        }

        {RotaPaciente && 
                <List>
                  <ListItemButton onClick={() => Navigation('/especialistas-disponiveis')}>
                          <ListItemText> Especialistas Disponiveis </ListItemText>
                  </ListItemButton> 

                  <ListItemButton onClick={() => Navigation('/agenda')}>
                          <ListItemText> Agenda </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => HandleBlood()}>
                          <ListItemText> Ache um Doador de Sangue </ListItemText>
                  </ListItemButton>
                </List>
        }

        {RotaUnidade && 
                <List>

                   <ListItemButton onClick={() => Navigation('/unidade-especialista')}>
                                <ListItemText> Inter Gestão </ListItemText>
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

         <ListItemButton onClick={() => HandleHistorico()}> Horarios </ListItemButton>
      </List>
        }
        
        {Agenda && Paciente && 
            <List>
                  <ListItemButton onClick={() => Navigation('/especialistas-disponiveis')}>
                          <ListItemText> Especialistas Disponiveis </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => Navigation('/agenda')}>
                          <ListItemText> Agenda </ListItemText>
                  </ListItemButton>

                  <ListItemButton onClick={() => HandleBlood()}>
                          <ListItemText> Ache um Doador de Sangue </ListItemText>
                  </ListItemButton>
                </List>
        }

        {Agenda && Unidade &&
         <List>

              <ListItemButton onClick={() => Navigation('/unidade-especialista')}>
                   <ListItemText> Inter Gestão </ListItemText>
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