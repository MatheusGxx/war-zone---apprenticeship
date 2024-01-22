import { TextField, Autocomplete } from '@mui/material'
import { EstadoCivis } from './EstadosCivis'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Logo from '../public/logo.png'
import Image from 'next/image'

export const RegisterFourPatient = ({
    setCartaoSUS,
    cartaoSUS,
    setEstadoCivil,
    estadoCivil,
    setProfissao,
    profissao,
    setCurrentStep,
}) => {

    const handleNextClick = () => {
        setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
      }
    
      const handleBackClick = () => {
        setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
      }
    
    return(
        <>
        <h1 className='font-bold text-blue-500 text-center text-2xl'> Informaçoes Adicionais </h1>
        <TextField
        variant="standard"
        label="Cartão SUS"
        InputProps={{
            sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => setCartaoSUS(e.target.value)}
        value={cartaoSUS}
        type="number"
        required
        />

    <Autocomplete
        value={estadoCivil === '' ? null : estadoCivil}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            setEstadoCivil(newValue);
          }
        }}
        options={EstadoCivis}
        noOptionsText="Sem resultados"
        renderInput={(params) => <TextField {...params} label="Estado Civil" variant="standard" />}
        className="w-full border-b border-blue-500 sm:w-full"
      />

     <TextField
        variant="standard"
        label="Profissão"
        InputProps={{
            sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => setProfissao(e.target.value)}
        value={profissao}
        type="text"
        required
        />

      <div className="w-full flex justify-between items-center">
        <ArrowBackIosIcon color="primary" className="cursor-pointer" onClick={handleBackClick}/>
        <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
        <ArrowForwardIosIcon color="primary" className="cursor-pointer" onClick={handleNextClick}/> 
      </div>

        </>
    )
}