import HealingIcon from '@mui/icons-material/Healing'
import { TextField } from '@mui/material'
import { useState } from 'react'
 
export const AtestadoDoctor = ({ 
    NomeMedico,
    CRMMedico, 
    NomePaciente, 
    CPFPaciente,
    DiasAfastamento, 
    CID,
    Localidade,
    date,
}) => {

    const [diasafastamento, setDiasAfastamento] = useState(DiasAfastamento)
    const [cid, setCID] = useState(CID)

    return(
        <>
        <div>
             <div className='flex justify-center items-center gap-5 mb-10'>
                <h1 className="font-bold text-blue-900 text-2xl"> Atestado </h1>
                <HealingIcon color="primary"/>
             </div>

             <div className='w-full flex justify-start flex-col'>

                <div className='w-full flex gap-3'>
                <h1 className='font-bold text-blue-900 white'>
                    Eu, {NomeMedico}, CRM: {CRMMedico}, atesto para os devidos fins que o(a) paciente {NomePaciente}, portador(a) do CPF: {CPFPaciente}, necessita de afastamento de suas
                    atividades laborais pelo período de

                    <TextField
                        label=""
                        variant="standard"
                        InputProps={{
                            sx: { borderBottom: "1px solid blue" },
                        }}
                        className ="w-1/6 ml-3"
                        required
                        onChange={(e) => setDiasAfastamento(e.target.value)}
                        value={diasafastamento}
                        />

                 dias, a contar desta data, por motivo de saúde
                </h1>

                </div>
    

                <div className='flex justify-center items-end w-full gap-3 mt-10'>
                    <h1 className='font-bold text-blue-900'> CID: </h1>
                    <TextField
                    label=""
                    variant="standard"
                    InputProps={{
                        sx: { borderBottom: "1px solid blue" },
                    }}
                    className ="w-full"
                    required
                    onChange={(e) => setCID(e.target.value)}
                    value={cid}
                    />
               </div> 

             </div>

             <h1 className='font-bold text-blue-900 mt-10'> Local e Data: {Localidade}, {date} </h1>

             <div className='w-full flex justify-start flex-col mt-10'> 
                <h1 className='font-bold text-blue-900'> {NomeMedico} </h1>
                <h1 className='font-bold text-blue-900'> {CRMMedico}</h1>
             </div>
        </div>
        </>
    )
}   