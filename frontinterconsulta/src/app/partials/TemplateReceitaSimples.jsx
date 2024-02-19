import { TextField } from '@mui/material'
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid'
import Image from 'next/image'
import Logo from '../public/logo.png'


export const TemplateReceitaSimples = ({
    index,
    data,
    NomePaciente,
    CPFPaciente,
    Endereço,
    NomeMedico,
    CRM,
    UF,
    date,
    HoraAtual,
    HandleChangeReceitaSimples,
}) => {
    return(
        <>
      <div key={index} className='w-full flex flex-col gap-3  border-blue-500 border-4 rounded-lg p-6'>
        <div className="flex justify-center items-center gap-5">
            <h1 className="font-bold text-blue-900 text-2xl"> Receita Simples {index + 1}</h1>
            <MedicationLiquidIcon color="primary"/>
        </div>
        <div className='flex gap-3 justify-start'>
            <h1> <span className="font-bold text-blue-900"> Nome: </span> {NomePaciente} </h1>
            <h1> <span className="font-bold text-blue-900">CPF: </span>{CPFPaciente}</h1>
        </div>

        <div className="flex justify-start mt-10 mb-10">
        <TextField
            label="Ficha do Paciente"
            variant="standard"
            InputProps={{
              sx: { borderBottom: "1px solid blue" },
             }}
            value={data}
            onChange={(e) => HandleChangeReceitaSimples(e.target.value)}
            className= "w-full"
            required
        />
        </div> 

        <div className='flex justify-start flex-col gap-3'>
          <h1> <span className='font-bold text-blue-900'> Endereço: </span> {Endereço} </h1>
          <h1 className='font-bold text-blue-900'> {NomeMedico} </h1>
          <div className='flex justify-start gap-5'>
          <h1 className="font-bold text-blue-900"> CRM: {CRM}</h1>
          <h1 className="font-bold text-blue-900"> UF: {UF} </h1>
          <h1 className='font-bold text-blue-900'> Data e Hora: {date} - {HoraAtual} </h1>
          </div>
        </div>

        <div className="flex justify-end p-4">
            <Image
              src={Logo}
              alt="Logo Interconsulta"
              height={40}
              width={40}
              className='animate-spin-slow'
            />
          </div>
        </div>
        </>
    )
}