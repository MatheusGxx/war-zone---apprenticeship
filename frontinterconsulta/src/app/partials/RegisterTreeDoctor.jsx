import { Checkbox } from '@mui/material'
import { FerramentasTerapeuticas } from '../partials/FerramentasTeperauticas.js'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'


export const RegisterTreeDoctor = (
  {
   setFerramentasTerapeuticas,
   setCurrentStep
  }
  ) => {

   const ValueCheckBoxFerramentas = (event, value) =>{
      if(event.target.checked){
        setFerramentasTerapeuticas((prev) => [...prev, value])
      }else{
        setFerramentasTerapeuticas((prev) => prev.filter((Ferramenta) => Ferramenta !== value))
      }
    }
    const handleNextClick = () => {
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
    }
  
    const handleBackClick = () => {
      setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
    }
    
    
  return(
    <>
      <h1 className="text-blue-500 text-center"> Ferramentas Terapeuticas </h1>
      <>
      </>
                
        {FerramentasTerapeuticas.map((item, index) => (
          <>
            <div className="flex">
              <Checkbox key={index} {...item} onChange={(event) => ValueCheckBoxFerramentas(event, item)}/>
                <div className="flex justify-center items-center">
                  <h1> {item}</h1>
                </div>
            </div>
          </>
          ))}
           <div className="w-full flex justify-between items-center">
                 <ArrowBackIosIcon color="primary" className="cursor-pointer" onClick={handleBackClick}/>
                 <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
                 <ArrowForwardIosIcon color="primary" className="cursor-pointer" onClick={handleNextClick}/>    
           </div>
        </>
  )
}
