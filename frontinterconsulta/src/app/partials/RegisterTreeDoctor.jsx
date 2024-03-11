import { Checkbox } from '@mui/material'
import { FerramentasTerapeuticas } from '../partials/FerramentasTeperauticas.js'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const RegisterTreeDoctor = ({
  setFerramentasTerapeuticas,
  setCurrentStep,
  ferramentasTerapeuticas,
  currentStep,
}) => {
  const ValueCheckBoxFerramentas = (event, value) => {
    if (event.target.checked) {
      setFerramentasTerapeuticas((prev) => [...prev, value])
    } else {
      setFerramentasTerapeuticas((prev) => prev.filter((Ferramenta) => Ferramenta !== value))
    }
  }

  const handleNextClick = () => {
    setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep))
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  return (
    <>
      <h1 className="text-blue-500 text-center"> Ferramentas Terapeuticas </h1>
      {FerramentasTerapeuticas.map((item, index) => (
        <div key={index} className="flex">
          <Checkbox
            {...item}
            checked={ferramentasTerapeuticas.includes(item)}
            onChange={(event) => ValueCheckBoxFerramentas(event, item)}
            label={item}
          />
        </div>
      ))}
      <div className="w-full flex justify-between items-center">
        <ArrowBackIosIcon
          color="primary"
          className="cursor-pointer"
          onClick={currentStep > 1 ? handleBackClick : null}
          disabled={currentStep === 1}
        />
        <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow" />
        <ArrowForwardIosIcon
          color="primary"
          className="cursor-pointer"
          onClick={currentStep < 5 ? handleNextClick : null}
          disabled={currentStep === 5}
        />
      </div>
    </>
  )
}
