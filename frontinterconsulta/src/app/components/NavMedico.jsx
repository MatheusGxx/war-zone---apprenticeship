import Link from 'next/link'
import DrawerPerfil from '../partials/DrawerNav'
import secureLocalStorage from 'react-secure-storage'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Avatar from '@mui/material/Avatar'
import { config } from '../config.js'

export const NavMédico = ({ 
  OpenDrawerMedico, 
  openDrawer,
  LoggoutDrawerMedico,
  HandleNavigationDrawer,
}) => {

    const FotoMedico = secureLocalStorage.getItem('FotoMedico')
    const idMedico = secureLocalStorage.getItem('id')

  return(
      <>
       <Link href="/casos-clinicos" className='sm:hidden md:hidden lg:hidden'>
          <p className='text-blue-800 sm:text-sm whitespace-nowrap font-bold'> Casos Clinicos</p>
       </Link>
            {FotoMedico ? 
               <div 
                className='mt-[-5px] relative'
                onClick={OpenDrawerMedico}
                 >
                <Avatar alt="Foto Médico" src={`${config.apiBaseUrl}/${FotoMedico}`} className='cursor-pointer'/>

                <DrawerPerfil
                 open={openDrawer}
                 Close={OpenDrawerMedico}
                 Image={`${config.apiBaseUrl}/${FotoMedico}`}
                 Loggout={LoggoutDrawerMedico}
                 Navigation={HandleNavigationDrawer}n
                 />
             </div>
             : idMedico ? 
             <>
             <div onClick={OpenDrawerMedico}>
             <AccountCircleIcon color="primary" className='cursor-pointer' fontSize='large'/>
             <DrawerPerfil
               open={openDrawer}
               Close={OpenDrawerMedico}
               Image={null}
               Loggout={LoggoutDrawerMedico}
               Navigation={HandleNavigationDrawer}
             />
             </div>
            </>
             :
              <Link href="/welcome">
                <p className='text-blue-800 sm:text-sm font-bold'>Login</p>
              </Link>
            }

            <div className='container'>
             <Link href="/agenda" className='sm:w-full md:w-full lg:w-full xl:-w-full'> 
             <button className='w-36 h-10 bg-red-600 rounded-full font-bold text-white xl:hidden'> 
             <p className='sm:text-s
              m text-center'> Agenda </p></button>
            </Link>
             </div>
        </>
    )
}