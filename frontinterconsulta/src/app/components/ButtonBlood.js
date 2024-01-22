'use client'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import { useState } from 'react'
import { PopUpBlood } from '../partials/PopUpBlood.js'

export const ButtonBlood = () => {
  
  const [active, setActive] = useState(false)

  const HandleClickGetBlood = () => {
    setActive(true)
  }
  return(
    <>
        <button 
         className='w-full p-2 bg-red-600 rounded-full font-bold text-white 
         sm:p-1 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 flex justify-center items-center gap-2'
         onClick={HandleClickGetBlood}>
          <p className='sm:text-sm text-center xl:w-full whitespace-nowrap text-sm'>Achar Doador de Sangue</p>
          <BloodtypeIcon color=''/>
        </button>

        {active && <PopUpBlood onClose={() => setActive(false)}/>}
    </>
  )
}