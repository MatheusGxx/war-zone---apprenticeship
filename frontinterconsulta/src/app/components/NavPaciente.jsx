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

  const FotoPaciente = secureLocalStorage.getItem('FotoPaciente')
  const FotoUnidade = secureLocalStorage.getItem('FotoUnidade')
  const NomeUnidade = secureLocalStorage.getItem('NomeUnidade')
  const idPaciente = secureLocalStorage.getItem('id')

  const router = useRouter()

  const HandleNavigation = (route) => {
      router.push(route)
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