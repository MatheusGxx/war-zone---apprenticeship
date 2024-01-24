import Image from 'next/image'
import Logo from '../public/logo.png'
import Link from 'next/link'


const Home = () => {
  return (
    <>
    <div className='min-h-screen flex flex-col justify-center items-center gap-5 w-full'>
     <h1 className='font-bold text-2xl text-blue-700'> Seja bem vindo ao Interconsulta V1</h1>
     <Image src={Logo} width={100} height={100} className='animate-spin-slow'/>

     <Link href="/welcome" className='w-full flex justify-center items-center'>
     <button className='p-2 bg-blue-700 rounded-full w-1/3 sm:w-1/2'> 
     <p className="font-bold text-white"> Começar Experiencia  </p>
     </button>
     </Link>
     
    </div> 
    </>
  )
}

export default Home