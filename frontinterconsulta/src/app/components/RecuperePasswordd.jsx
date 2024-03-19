import { TextField } from "@mui/material"
import IconBack from "../partials/IconBack"
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import { useSearchParams } from "next/navigation"


const RecuperePassword = () => {
  const params = useSearchParams()

  const confirmationLinkGmail = params.get('recupere')
    return(
        <>
         <div className='container'>
            <div className='pl-10 relative top-10'>
            <IconBack />
            </div>
        <section className="flex flex-col gap-11 justify-center items-center sm:gap-8 lg:gap-10 -mt-4">
            <Image
              src={Logo}
              alt='Logo Interconsulta'
              height={150}
              width={150}
              className='animate-spin-slow'
            />
          <h1 className='text-blue-600 text-3xl text-center'>Coloque o seu Email e recupere <br/> a sua senha agora mesmo!</h1>
           <TextField id="standard-basic" label="Email" variant="standard" sx={{ width: '300px'}} type="email" required/>
           <button className='w-72 h-12 rounded-full bg-indigo-950 text-white font-light'> Recuperar Senha </button>
            <Image
            src={Logo2}
            alt="Logo 2 Interconsulta"
            height={200}
            width={220}
            />
        </section>
      </div>
        </>
    )
}


export default RecuperePassword