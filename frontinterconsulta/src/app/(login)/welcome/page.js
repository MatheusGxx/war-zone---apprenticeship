'use client'
import Image from 'next/image'
import ImageLogin from '../../public/ImageLogin.png'
import Logo from '../../public/logo.png'
import SecondLogo from '../../public/Logo2.png'
import { useRouter } from 'next/navigation'


const Welcome = () => {

  const Router = useRouter()

  const HandleClick = async (route) =>{
      await Router.push(`/welcome/${route}`)
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