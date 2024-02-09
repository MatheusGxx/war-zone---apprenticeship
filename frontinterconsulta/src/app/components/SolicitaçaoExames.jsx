import { TextField } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { useState } from 'react'

export const SolicitaçaoExames = ({ date, 
    nomePaciente,
    nomeMedico,
    CRMMedico,
    UFMedico,
    EstadoMedico,
    BairroMedico,
    CidadeMedico,
    SolicitarExames
 }) => {

    const [prescriçao, setPescriçao] = useState(SolicitarExames)
    
    return(
        <>
        <div>
        <div className="flex justify-center items-center mb-4 gap-5">
          <NoteAddIcon color="primary"/>
          <h1 className='text-blue-900 font-bold text-2xl'>Solicitaçao de Exames</h1>
        </div>
         <div className='flex justify-start flex-col gap-5 w-full items-start'>
        <div className='flex gap-5 w-full'>

        <div className='flex justify-center items-end'>
        <h1 className='text-blue-900 font-bold'> Paciente: </h1>
        </div>

         <TextField
             label=""
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
                readOnly: true
             }}
              className = "w-full"
              required
              value={nomePaciente}
            />
        </div>
    
        <h1 className='font-bold text-blue-900'>Solicito:</h1>
         
         <TextField
             label="Solicito"
             variant="outlined"
             InputProps={{
                sx: { border: "1px solid blue" },
             }}
              className = "w-full"
              required
              multiline
              onChange={(e) => setPescriçao(e.target.value)}
              value={prescriçao}
              rows={10}
          />

        <div className='flex flex-col gap-3 w-full'>

           <div className="flex justify-start items-center w-full gap-5">

             <div className='flex justify-center items-end w-full gap-3'>
             <h1 className="font-bold text-blue-900 whitespace-nowrap"> Nome do Médico(a): </h1>
             <TextField
             label=""
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
                readOnly: true
             }}
              className ="w-full"
              required
              value={nomeMedico}
             />
            </div>

             <div className='flex justify-center items-end w-full gap-3'>
             <h1 className="font-bold text-blue-900"> CRM: </h1>
             <TextField
             label=""
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
                readOnly: true
             }}
              className ="w-full"
              required
              value={CRMMedico}
          />
            </div>

            <div className='flex justify-center items-end w-full gap-3'>
             <h1 className="font-bold text-blue-900"> UF: </h1>
             <TextField
             label=""
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
                readOnly: true
             }}
              className ="w-full"
              required
              value={UFMedico}
             />
            </div>

           </div>

           <div  className="flex justify-start items-center w-full gap-5">
             <div className='flex justify-center items-end w-full gap-3'>
                <h1 className='font-bold text-blue-900 whitespace-nowrap'> Local de Atendimento:</h1>
                <TextField
                label=""
                variant="standard"
                InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                    readOnly: true
                }}
                className ="w-full"
                required
                value="Teledicima"
                />
             </div> 
           </div>

           <div  className="flex justify-start items-center w-full gap-5">
             <div className='flex justify-center items-end w-full gap-3'>
                <h1 className='font-bold text-blue-900'> Estado: </h1>
                <TextField
                label=""
                variant="standard"
                InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                    readOnly: true
                }}
                className ="w-full"
                required
                value={EstadoMedico}
                />
             </div> 

             <div className='flex justify-center items-end w-full gap-3'>
                <h1 className='font-bold text-blue-900'> Bairro: </h1>
                <TextField
                label=""
                variant="standard"
                InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                    readOnly: true
                }}
                className ="w-full"
                required
                value={BairroMedico}
                />
             </div> 
           </div>

           <div  className="flex justify-start items-center w-full gap-5">
             <div className='flex justify-center items-end w-full gap-3'>
                <h1 className='font-bold text-blue-900'> Cidade: </h1>
                <TextField
                label=""
                variant="standard"
                InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                    readOnly: true
                }}
                className ="w-full"
                required
                value={CidadeMedico}
                />
             </div> 
           </div>

           <div  className="flex justify-start items-center w-full gap-5">
             <div className='flex justify-center items-end w-full gap-3'>
                <h1 className='font-bold text-blue-900 whitespace-nowrap'> Data de Emissão: </h1>
                <TextField
                label=""
                variant="standard"
                InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                    readOnly: true
                }}
                className ="w-full"
                value={date}
                required
                />
             </div> 
           </div>

        </div>
     </div>
        </div>
        </>
    )
}