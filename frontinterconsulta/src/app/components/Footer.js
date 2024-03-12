import SecondLogo from '../public/Logo-Interconsulta-Branco.png'
import Image from 'next/image'

const Footer = () =>{
  return(
    <>
      <footer className="bg-blue-900 container p-2 sm:p-2">
          <div className='pl-20 sm:p-0 sm:flex justify-center'>
            <Image
              src={SecondLogo}
              alt='Segundo Logo Interconsulta'
              width={200}
              height={100}
            />
          </div>
      </footer>
    </>
  )
}

export default Footer