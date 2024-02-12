import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid'
import { TextField } from '@mui/material'
import { useState } from 'react'

export const ReceitaSimples = ({
    NomePaciente,
    CPFPaciente,
    ReceitaEscrita,
    Endereço,
    NomeMedico,
    CRM,
    UF,
    date,
    HoraAtual,
}) => {
    const [receita, setReceita] = useState(ReceitaEscrita)
    return(
        <>
        <div className='w-full'>
        <div className="flex justify-center items-center gap-5">
            <h1 className="font-bold text-blue-900 text-2xl"> Receita Simples</h1>
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
            onChange={(e) => setReceita(e.target.value)}
            value={receita}
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
        </div>
        </>
    )
}