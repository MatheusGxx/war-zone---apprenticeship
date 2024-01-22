import LogoVermelho from '../../public/LogoIconVermelho.png'
import Image from 'next/image'

const ConsultorioPai = () => {
  return(
    <>
    <div className='min-h-screen flex justify-center items-center'>
     <Image src={LogoVermelho} alt="Logo Interconsulta Vermelho" width={200} height={200} className='animate-spin-slow'/>
    </div>
    </>
  )
}


export default ConsultorioPai