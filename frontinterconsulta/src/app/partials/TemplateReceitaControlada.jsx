import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid'
import { TextField } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const TemplateReceitaControlada = ({
    Endereço,
    NomeMedico,
    CRM,
    UF,
    CidadeMedico,
    NomePaciente,
    EnderecoPaciente,
    CPFPaciente,
    date,
    index,
    data,
    HandleChangeReceitaC,
    HandleChangeReceitaSimples
}) => {
    return(
        <>
     <div key={index} className='w-full border-blue-500 border-4 rounded-lg p-6'>
        <div className="flex justify-center items-center gap-5">
            <h1 className="font-bold text-blue-900 text-2xl"> Receita Controlada {index + 1} </h1>
            <MedicationLiquidIcon color="primary"/>
        </div>

        <div className='flex gap-5 container mt-10'>

        <div className='flex gap-3 flex-col container border-2 border-blue-500 rounded-lg p-3'>
            <h1 className='flex justify-center items-center font-bold text-lg text-blue-900'> Identificação do Emitente </h1>
            <div className='flex justify-start items-center gap-3'>
              <h1> Nome: {NomeMedico} </h1>
            </div>
            <div className='flex justify-start items-center gap-3'>
              <h1> CRM: {CRM} </h1>
            </div>

            <div className='flex justify-start items-center gap-3'>
              <h1> Endereço: {Endereço}</h1>
            </div>

            <div className='flex justify-start items-center gap-3'>
              <h1> Cidade e UF: {CidadeMedico} - {UF}</h1>
            </div>
        </div>

        <div className='flex flex-col gap-3 container '>
        <h1 className='flex justify-center items-center font-bold text-lg text-blue-900'> Receituário Controle Especial </h1>
            <h1> Data: {date} </h1>
            <h1>1a. via Farmacia</h1>
            <h1>2a. via Paciente</h1>
            <div className="border-b-2 border-blue-500  w-full"></div>
        </div>
        </div>

        <div className="flex justify-start items-start flex-col ml-3 mt-3 gap-2">
           <h1 className='font-bold text-blue-900'> {NomePaciente} </h1>
           <h1> <span className='font-bold text-blue-900'> CPF: </span>{CPFPaciente} </h1>
           <h1> <span className="font-bold text-blue-900"> Endereço: </span>{EnderecoPaciente} </h1>
       
           <TextField
             label=""
             variant="outlined"
             InputProps={{
                sx: { border: "1px solid blue" },
             }}
             className ="w-1/2"
             required
             value={data}
             onChange={(e) => HandleChangeReceitaC(e.target.value)}
             rows={4}
             multiline
             />

        </div>

        <div className='flex gap-3 container mt-10'>

        <div className='flex gap-3 flex-col container border-2 border-blue-500 rounded-lg p-3'>
        <h1 className='flex justify-center items-center font-bold text-lg text-blue-900'> Identificação do Comprador </h1>
            <div className='flex justify-start items-center gap-3'>
            <h1> Nome: </h1>
            </div>
            <div className='flex justify-start items-center gap-3'>
            <h1> RG: </h1>
            </div>

            <div className='flex justify-start items-center gap-3'>
            <h1> Endereço: </h1>
            </div>

            <div className='flex justify-start items-center gap-3'>
            <h1> Cidade e UF: </h1>
            </div>
        </div>

        <div className='flex flex-col gap-3 container border-2 border-blue-500 rounded-lg p-3'>
        <h1 className='flex justify-center items-center font-bold text-lg text-blue-900'> Identificação do Fornecedor </h1>
        <div className="border-b-2 border-blue-500  w-full"></div>
            <h1> Data: </h1>
        <div className="border-b-2 border-blue-500  w-full"></div>
            <h1> Assinatura do Farmaceutico: </h1>
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