'use client'
import Baixar from '../partials/Baixar.js'
import secureLocalStorage from 'react-secure-storage'
import Image from 'next/image'
import Logo from '../public/logo.png'

const MainUnidade = ({title, subTitle, Component}) =>{

  const NameUnidadeLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false

  const NomeUnidade = NameUnidadeLocal || ''
  
  const FotoUnidade = secureLocalStorage.getItem('FotoUnidade')

  return(
    <>
      <main className="flex-1 bg-blue-100 p-8 flex items-center flex-col gap-8 sm:gap-4 lg:flex justify-center lg:items-center lg:p-4">

      <section className= "flex gap-2 justify-start sm:text-center">
    
        <div className="flex flex-col w-full sm:flex sm:justiy-center sm:items-center  md:flex md:justiy-center md:items-center lg:flex lg:justify-center lg:items-center"> 


        <h2 className="text-3xl font-bold text-blue-900 sm:text-sm md:whitespace-nowrap lg:text-2xl md:text-center xl:text-center">
          <div className='flex gap-5'>
            {title} {NomeUnidade ? `do ${NomeUnidade}` : ''}
            {NomeUnidade && <Image src={`${config.apiBaseUrl}/${FotoUnidade}`} width={50} height={50} alt='Logo Unidade de Saude' className='rounded-full' />}
          </div>
        </h2>
  
          <div className="flex gap-10 sm:gap-5 flex-wrap sm:justify-center md:justify-center lg:justify-center xl:justify-center w-full xl:flex xl:flex-col xl:items-center">
            
            <h2 className="text-2xl text-blue-700 font-bold sm:text-sm whitespace-wrap lg:text-xl md:text-center xl:text-center">{subTitle}</h2>
            <Baixar/>
          </div>

          <div className="border-b-2 border-red-500  w-1/3  pt-3 sm:hidden md:hidden lg:hidden xl:hidden"></div>
        </div>

       </section>

       <div className='bg-white  min-h-[350px]  w-7/12 sm:w-full md:w-full lg:w-full rounded-lg flex justify-center items-center'>
       <Component/>
       </div>
       </main>
    </>
  )
}

export default MainUnidade

