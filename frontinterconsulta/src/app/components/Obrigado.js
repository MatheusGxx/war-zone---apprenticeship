'use client'
import SecondLogo from '../public/Logo2.png'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import FormularioMédico from '../partials/FormularioMédico.js'
import FormularioUnidade from '../partials/FormularioUnidade.js'
import { config } from '../config.js'


const Obrigado = ({ImagemLateral, title, copy}) =>{

  const pathname = usePathname()

  const RotaUnidade = pathname ===  '/welcome/login-unidade/cadastro-unidade/obrigado-unidade'

  return(
    <>
    <main className="flex">
        <section className="w-1/2 sm:hidden md:hidden lg:hidden">
           <Image
             src={ImagemLateral}
             alt="Imagem Login"
           />  
        </section>

        <section className="w-1/2 sm:w-full md:w-full lg:w-full">
            <div className='flex flex-col gap-16 sm:gap-12 md:gap-5 lg:gap-6 items-center justify-center mt-32 sm:mt-6'>
            <div className='flex'>
              <h1 className='text-red-500 text-3xl text-center sm:text-lg'>{title}</h1>
            </div>
  
            <h3 className="whitespace-pre-wrap text-lg text-center sm:text-base">{copy}</h3>

            {RotaUnidade && <FormularioUnidade/>}
            
              <Image
              src={SecondLogo}
              alt='SecondLogo'
              height={200}
              width={220}
              />            
            </div>
        </section>

      </main>  
    </>
  )
}

export default Obrigado