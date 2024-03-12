import Logo2 from '../public/Logo2.png'
import Image from 'next/image'
import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import DrawerComponent from '../partials/Drawer'
import LogoInterGestão from '../public/LogoInterGestão.png'
import secureLocalStorage from 'react-secure-storage'

const Nav = () => {
  const [open, setOpen] = useState(false)
  const Route = usePathname()
  const router = useRouter()

  const logout = () => {
    secureLocalStorage.clear()
    router.push('/')
  }

  const routes = [
    { path: '/casos-clinicos', component: <NavMédico logout={logout} /> },
    { path: '/especialistas-disponiveis', component: <NavPaciente logout={logout} /> },
    { path: '/unidade-especialista', component: <NavUnidadeSaude logout={logout} /> },
  ]

  const HandleNavigation = (route) => {
    setOpen(false)
    router.push(route)
  }

  const HandleDrawer = () => setOpen(!open)

  const LoggoutDrawerMedico = () => {
    const names = ['NomeMedico', 'NomePaciente', 'NomeUnidade']
    names.forEach((name) => {
      if (secureLocalStorage.getItem(name)) {
        logout()
      }
    })
  }

  return (
    <>
      <nav className='p-3 flex justify-between border-b border-blue-500 border-l border-r rounded-b-lg sm:flex sm:flex-col sm:justify-center items-center sm:w-full sm:gap-5 md:flex md:flex-col md:justify-center md:items-center md:w-full md:gap-5 lg:flex lg:flex-col lg:justify-center lg:items-center lg:w-full lg:gap-5 lg:p-2'>
        <div className='flex sm:justify-center items-center gap-5'>
          {Route === '/unidade-especialista' ? (
            <Link href='/unidade-especialista'>
              <Image src={LogoInterGestão} alt='Logo2' height={30} width={180} className='pl-3 pt-1' />
            </Link>
          ) : (
            <Image src={Logo2} alt='Logo2' height={30} width={220} className='pl-3 pt-1' />
          )}

          <div className='2xl:hidden xl:hidden sm:flex sm:justify-center sm:items-center pt-5 md:flex md:justify-center md:items-center lg:flex lg:justify-center lg:items-center' onClick={HandleDrawer}>
            <MenuIcon />
          </div>
        </div>

        <div className='flex gap-10 justify-center items-center sm:w-10/12 sm:flex-col sm:gap-1 md:w-1/2 md:flex-col md:gap-1 lg:flex-col lg:gap-1'>
          {routes.map(({ path, component }, index) => (
            <div key={index}>{Route === path && component}</div>
          ))}

          <DrawerComponent open={open} Close={HandleDrawer} Navigation={HandleNavigation} />
        </div>
      </nav>
    </>
  )
}

export default Nav
