import Logo2 from '../public/Logo2.png'
import Image from 'next/image'
import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DrawerComponent } from '../partials/Drawer.js'
import LogoInterGestão from '../public/LogoInterGestão.png'
import secureLocalStorage from 'react-secure-storage'
import { NavMédico } from './NavMedico'
import { NavPaciente } from './NavPaciente'
import { NavUnidadeSaude } from './NavUnidadeSaude'

const Nav = () => {

  const [open, setOpen] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  const Route = usePathname()
  
  const RotaMédico = Route === '/casos-clinicos';

  const RotaPaciente = Route === '/especialistas-disponiveis'

  const RotaUnidade = Route ===  '/unidade-especialista'

  const RouteAgenda = Route === '/agenda'

  const LocalNomeMedico = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeMedico') : false

  const LocalNomePaciente = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false

  const LocalNomeUnidade = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false

  useEffect(() => {

  }, [Route])
  
  const Router = useRouter()

  const HandleNavigation = (route) =>{
    HandleDrawer()
    Router.push(route)
  }

  const HandleDrawer = () => setOpen(!open)

  const LoggoutDrawerMedico = (route) => {
    switch (Route) {
      case '/especialistas-disponiveis':
        Router.push(route);
        secureLocalStorage.clear()
        break;
      case '/casos-clinicos':
        Router.push(route);
        secureLocalStorage.clear()
        break;
      case '/unidade-especialista':
        Router.push(route);
        secureLocalStorage.clear()
        break

      case '/agenda':

      const Medico =  secureLocalStorage.getItem('NomeMedico')
      const Paciente = secureLocalStorage.getItem('NomePaciente')
      const Unidade =  secureLocalStorage.getItem('NomeUnidade')

      if(Medico){
        Router.push(route);
        secureLocalStorage.clear()
      }
      if(Paciente){
        Router.push(route);
        secureLocalStorage.clear()
      }
      if(Unidade){
        Router.push(route)
        secureLocalStorage.clear()
      }
      break
      default:
        break
    }
  };

  const HandleNavigationDrawer = (route) =>{
    OpenDrawerMedico()
    Router.push(route)
  }

  const OpenDrawerMedico = () =>  setOpenDrawer(!openDrawer)
  
  return(
    <>
    <nav 
    className='p-3 flex justify-between 
    border-b border-blue-500 border-l border-r rounded-b-lg 
    sm:flex sm:justify-center items-center sm:w-full
    sm:gap-5 
    md:flex md:flex-col md:justify-center md:items-center 
    md:w-full md:gap-5
    lg:flex lg:flex-col lg:justify-center lg:items-center lg:w-full lg:gap-5 lg:p-2
    '>

      <div className='flex sm:justify-center items-center gap-5'>

        {RotaUnidade ?  
         <Link href="/unidade-especialista">
          <Image
          src={LogoInterGestão}
          alt="Logo2"
          height={30}
          width={180}
          className='pl-3 pt-1'
          />
        </Link> 
         : 
          <Image
          src={Logo2}
          alt="Logo2"
          height={30}
          width={220}
          className='pl-3 pt-1'
          />
         }

        <div 
        className='2xl:hidden xl:hidden
        sm:flex sm:justify-center sm:items-center pt-5
        md:flex md:justify-center md:items-center
        lg:flex lg:justify-center lg:items-center
        '
        
        onClick={HandleDrawer}>
            <MenuIcon/>
        </div>

      </div>

      <div 
      className='flex gap-10 justify-center items-center
      sm:w-10/12 sm:gap-1
      md:w-1/2 md:flex-col md:gap-1
      lg:flex-col lg:gap-1
      '>
         {RotaMédico && 
         <>
          <NavMédico
          OpenDrawerMedico={() => OpenDrawerMedico()}
          openDrawer={openDrawer}
          LoggoutDrawerMedico={LoggoutDrawerMedico}
          HandleNavigationDrawer={HandleNavigationDrawer}
          />
         </>
         }

         {RotaPaciente && 
          <>
           <NavPaciente
            OpenDrawerMedico={() => OpenDrawerMedico()}
            openDrawer={openDrawer}
            LoggoutDrawerMedico={LoggoutDrawerMedico}
            HandleNavigationDrawer={HandleNavigationDrawer}
           />
          </>
         }

         {RotaUnidade &&
          <>
           <NavUnidadeSaude
            OpenDrawerMedico={() => OpenDrawerMedico()}
            openDrawer={openDrawer}
            LoggoutDrawerMedico={LoggoutDrawerMedico}
            HandleNavigationDrawer={HandleNavigationDrawer}
           />
          </>
         }
  
        {RouteAgenda && LocalNomeMedico  && 
        <>
          <NavMédico
           OpenDrawerMedico={() => OpenDrawerMedico()}
           openDrawer={openDrawer}
           LoggoutDrawerMedico={LoggoutDrawerMedico}
           HandleNavigationDrawer={HandleNavigationDrawer}
          />
        </> 
        }

        {RouteAgenda && LocalNomePaciente && 
        <>
         <NavPaciente
          OpenDrawerMedico={() => OpenDrawerMedico()}
          openDrawer={openDrawer}
          LoggoutDrawerMedico={LoggoutDrawerMedico}
          HandleNavigationDrawer={HandleNavigationDrawer}
           />
        </> 
        }

      {RouteAgenda && LocalNomeUnidade &&
        <>
          <NavUnidadeSaude
           OpenDrawerMedico={() => OpenDrawerMedico()}
           openDrawer={openDrawer}
           LoggoutDrawerMedico={LoggoutDrawerMedico}
           HandleNavigationDrawer={HandleNavigationDrawer}
           />
        </> 
        }

     <DrawerComponent open={open} Close={HandleDrawer} Navigation={HandleNavigation}/>
     </div>
    </nav>
    </>
  )
}

export default Nav
