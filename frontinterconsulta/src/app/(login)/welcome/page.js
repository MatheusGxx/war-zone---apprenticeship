'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageLogin from '../../public/ImageLogin.png'
import Logo from '../../public/logo.png'
import SecondLogo from '../../public/Logo2.png'
import { useRouter, useSearchParams } from 'next/navigation'


const Welcome = () => {

  const [okUTM, setOkUTM] = useState(false)

  const Router = useRouter()
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
  
  useEffect(() => {
    if(referrer && funil && temp && rota && source && medium && campaign && term && content){
      setOkUTM(true)
    }

  },[okUTM])

  const HandleClick = (route) => {
      if(okUTM){
        Router.push(`/welcome/${route}?UTM_Referrer=${encodeURIComponent(referrer)}&UTM_Funil=${encodeURIComponent(funil)}&UTM_Temp=${encodeURIComponent(temp)}&UTM_Rota=${encodeURIComponent(rota)}&UTM_Source=${encodeURIComponent(source)}&UTM_Medium=${encodeURIComponent(medium)}&UTM_Campaign=${encodeURIComponent(campaign)}&UTM_Term=${encodeURIComponent(term)}&UTM_Content=${encodeURIComponent(content)}`)
      }else{
        Router.push(`/welcome/${route}`)
      }
  }


  return(
    <>
      <main className="flex">

        <section className="w-1/2 sm:hidden md:hidden lg:hidden">
              <Image
                src={ImageLogin}
                alt="Imagem Login"
      
        />  
        </section>

        <section className="w-1/2 sm:w-full md:w-full lg:w-full flex justify-center">
       
          <div className='flex flex-col gap-14 my-5 sm:gap-10 lg:gap-7 2xl:gap-11'>
            <div className='flex justify-center'>
              <Image
              src={Logo}
              alt='Logo'
              height={150}
              width={150}
              className='animate-spin-slow'
              />
            </div>
            <h1 className='text-3xl text-center'>O que voce é?</h1>

            <button  onClick={() => HandleClick('/login-medico')}  className='w-72 h-12 rounded-full bg-blue-500 text-white font-bold'> Médico </button>

            <button  onClick={() => HandleClick('/login-unidade')}  className='w-72 h-12 rounded-full bg-indigo-950 text-white font-bold'> Unidade de Saude </button>
            
            <button  onClick={() => HandleClick('/login-paciente')}  className='w-72 h-12 rounded-full bg-red-500 text-white font-bold'> Paciente </button>
            <div className='my-12 flex justify-center'>
              <Image
              src={SecondLogo}
              alt='SecondLogo'
              height={200}
              width={220}
              />
            </div>

            </div>
        </section>

      </main>
    </>
  )
}

export default Welcome