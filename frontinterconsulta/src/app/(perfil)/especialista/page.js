import Logo from '../../public/logo.png'
import Image from 'next/image'
import Link from 'next/link'

const FakePerfil = () => {
  return(
    <>
     <div className="min-h-screen flex justify-center items-center flex-col gap-10">
     <Image src={Logo} alt="Logo Interconsulta Vermelho" width={150} height={150} className='animate-spin-slow'/>

     <Link href="/agenda">
       <button className='p-2 rounded-xl bg-blue-500 text-white font-bold'> Voltar para a Agenda
       </button>
       
     </Link>
     </div>
    </>
  )
}

export default FakePerfil