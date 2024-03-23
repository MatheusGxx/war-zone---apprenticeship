'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DrawerPerfil from '../partials/DrawerNav'
import secureLocalStorage from 'react-secure-storage'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Avatar from '@mui/material/Avatar'
import { config } from '../config.js'
import { useRouter, useSearchParams } from 'next/navigation'


export const NavPaciente = ({
  OpenDrawerMedico,
  openDrawer,
  LoggoutDrawerMedico,
  HandleNavigationDrawer,
}) => {

  const [okUTM, setOkUTM] = useState(false)

  const FotoPaciente = secureLocalStorage.getItem('FotoPaciente')
  const FotoUnidade = secureLocalStorage.getItem('FotoUnidade')
  const NomeUnidade = secureLocalStorage.getItem('NomeUnidade')
  const idPaciente = secureLocalStorage.getItem('id')

  const params = useSearchParams()
    
  const referrer = params.get('UTM_Referrer') 
  const funil = params.get('UTM_Funil') 
  const temp = params.get('UTM_Temp')  
  const rota = params.get('UTM_Rota')
  const source = params.get('UTM_Source') 
  const medium = params.get('UTM_Medium') 
  const campaign = params.get('UTM_Campaign') 
  const term = params.get('UTM_Term') 
  const content = params.get('UTM_Content')

  const router = useRouter()

  useEffect(() => {
    if(referrer && funil && temp && rota && source && medium && campaign && term && content){
      setOkUTM(true)
    }

  },[okUTM])

  const HandleNavigation = (route) => {
    if(okUTM){
      router.push(`${route}?UTM_Referrer=${encodeURIComponent(referrer)}&UTM_Funil=${encodeURIComponent(funil)}&UTM_Temp=${encodeURIComponent(temp)}&UTM_Rota=${encodeURIComponent(rota)}&UTM_Source=${encodeURIComponent(source)}&UTM_Medium=${encodeURIComponent(medium)}&UTM_Campaign=${encodeURIComponent(campaign)}&UTM_Term=${encodeURIComponent(term)}&UTM_Content=${encodeURIComponent(content)}`)
    }else{
      router.push(route)
    }
  }
    return(
      <>
          <p 
          className='text-blue-800 sm:text-sm whitespace-nowrap font-bold sm:hidden md:hidden lg:hidden cursor-pointer'
          onClick={() =>  HandleNavigation('/especialistas-disponiveis')}>
             Especialistas Disponiveis
          </p>

            {FotoPaciente ? 
               <div 
                className='mt-[-5px] relative cursor-pointer'
                onClick={OpenDrawerMedico}
                 >
                <Avatar alt="Foto Médico" src={`${config.apiBaseUrl}/${FotoPaciente}`} className='cursor-pointer'/>

                <DrawerPerfil
                 open={openDrawer}
                 Close={OpenDrawerMedico}
                 Image={`${config.apiBaseUrl}/${FotoPaciente}`}
                 Loggout={LoggoutDrawerMedico}
                 Navigation={HandleNavigationDrawer}
                 />
             </div>
             :
             FotoUnidade ?
              <> 
              <div 
                className='mt-[-5px] relative cursor-pointer'
                onClick={OpenDrawerMedico}
                 >
                <Avatar alt="Foto Médico" src={`${config.apiBaseUrl}/${FotoPaciente}`} className='cursor-pointer'/>

                <DrawerPerfil
                 open={openDrawer}
                 Close={OpenDrawerMedico}
                 Image={`${config.apiBaseUrl}/${FotoPaciente}`}
                 Loggout={LoggoutDrawerMedico}
                 Navigation={HandleNavigationDrawer}
                 />
             </div>
              </>
              : 
             idPaciente ? 
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
                <p 
                className='text-blue-800 sm:text-sm font-bold cursor-pointer'  
                onClick={() =>  HandleNavigation('/welcome')}>
                Login
                </p>
            }

            <div className='container'>
             <button
              className='w-36 h-10 bg-red-600 rounded-full font-bold text-white xl:hidden sm:w-full md:w-full lg:w-full cursor-pointer'
              onClick={() =>  HandleNavigation('/agenda')}
              > 
             <p className='sm:text-s
              m text-center cursor-pointer'> Agenda </p></button>
             </div>
      </>
    )
}