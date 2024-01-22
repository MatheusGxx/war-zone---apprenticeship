import { Autocomplete, TextField } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Estados } from './Estados'
import Logo from '../public/logo.png'
import Image from 'next/image'

export const RegisterSecondPatient = ({ 
    setCEP,
    CEP,
    setEndereco,
    endereco,
    setCidade,
    cidade,
    setEstado,
    estado,
    setPais,
    pais,
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
       <h1 className='font-bold text-blue-500 text-2xl text-center'> Endereço </h1>  

     <TextField
            variant="standard"
            label="Endereço"
            InputProps={{
            sx: { borderBottom: "1px solid blue" }
            }}
            onChange={(e) => setEndereco(e.target.value)}
            value={endereco}
            type="text"
            required
    />

    <TextField
            variant="standard"
            label="Cidade"
            InputProps={{
            sx: { borderBottom: "1px solid blue" }
            }}
            onChange={(e) => setCidade(e.target.value)}
            value={cidade}
            type="text"
            required
    />


     <Autocomplete
        value={estado === '' ? null : estado}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            setEstado(newValue);
          }
        }}
        options={Estados}
        noOptionsText="Sem resultados"
        renderInput={(params) => <TextField {...params} label="Estado" variant="standard" />}
        className="w-full border-b border-blue-500 sm:w-full"
      />

    <TextField
        variant="standard"
        label="Pais"
        InputProps={{
          sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => setPais(e.target.value)}
        value={pais}
        type="text"
        required
    />

    <TextField
         variant="standard"
         label="CEP"
         InputProps={{
           sx: { borderBottom: "1px solid blue" }
         }}
         onChange={(e) => setCEP(e.target.value)}
         value={CEP}
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