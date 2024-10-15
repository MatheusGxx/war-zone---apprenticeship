import {
  Drawer,
} from '@mui/material'

import { ComponentDrawerMédico } from './ComponenteDrawerMedico'
import { ComponentDrawerUnidade } from './ComponenteDrawerUnidade'
import { ComponentDrawerPaciente } from './ComponenteDrawerPaciente'
import secureLocalStorage from 'react-secure-storage'
import { config } from '../config.js'

const DrawerPerfil = ({ open, Close, Loggout, Image, Navigation}) => {

  const NomeMedico = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeMedico') : false

  const NomePaciente = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false

  const NomeUnidade = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false

  return (
    <Drawer anchor="right" open={open} onClose={Close}>
      <div style={{ width: '250px' }}>
        {NomeMedico &&
         <ComponentDrawerMédico
          Navigation={Navigation} 
          Loggout={Loggout}
          Image={Image}
          />
        }
        {NomePaciente &&  
         <ComponentDrawerPaciente
         Navigation={Navigation}
         Loggout={Loggout}
         Image={Image}
         />

         }
        {NomeUnidade &&
         <ComponentDrawerUnidade
          Navigation={Navigation}
          Loggout={Loggout}
          Image={Image}
        />
        }

      </div>
    </Drawer>
  );
};
export default DrawerPerfil
