import Logo from '../public/Logo-Interconsulta-Branco.png'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-blue-900 container p-2 sm:p-2 flex justify-center items-center">
      <Image
        src={Logo}
        alt="Second Logo Interconsulta"
        width={200}
        height={100}
      />
    </footer>
  )
}

export default Footer
