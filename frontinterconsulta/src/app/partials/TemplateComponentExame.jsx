'use client'
import { TextField } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import EditIcon from '@mui/icons-material/Edit'
import Image from 'next/image'
import Logo from '../public/logo.png'
import { useState } from 'react'

const TemplateComponenteExame = ({
    key,
    index,
    date, 
    nomePaciente,
    nomeMedico,
    CRMMedico,
    EnderecoMedico,
    data,
    handleChangeExame,
}) => {
    return(
        <div className="flex flex-col gap-3 border-blue-500 border-4 rounded-lg p-6" key={index}>
        <div className='mt-5'>
        <div className="flex justify-center items-center mb-4 gap-5">
          <NoteAddIcon color="primary"/>
          <h1 className='text-blue-900 font-bold text-2xl'>Solicitaçao de Exames {index + 1}</h1>
        </div>
         <div className='flex justify-start flex-col gap-5 w-full items-start'>
        <div className='flex gap-5 w-full'>

        <div className='flex justify-center items-end'>
        <h1 className='text-blue-900 font-bold'> Paciente: </h1>
        </div>

         <TextField
             label=""
             variant="standard"
             sx={{ borderBottom: "1px solid blue" }}
             disabled
             required
             value={nomePaciente}
             className = "w-full"
            />
        </div>
    
        <h1 className='font-bold text-blue-900' sx={{ mb: 2 }}>Solicito:</h1>

        <div className="flex justify-center items-center gap-3 w-full">

            <TextField
               variant="outlined"
               sx={{ border: "1px solid blue" }}
               name="Exame"
               value={data}
               onChange={(e) => handleChangeExame(e.target.value)}
               className="w-full"
               rows={4}
               multiline
               minRows={4}
               maxRows={6}
               required
                  />
                  
            </div>
     

        <div className='flex flex-col gap-3 w-full'>

           <div className="flex justify-start items-center w-full gap-5">

             <div className='flex justify-center items-end w-full gap-3'>
             <h1 className="font-bold text-blue-900 whitespace-nowrap"> Nome do Médico(a): </h1>
             <TextField
             label=""
             variant="standard"
             sx={{ borderBottom: "1px solid blue" }}
             disabled
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
             sx={{ borderBottom: "1px solid blue" }}
             disabled
              className ="w-full"
              required
              value={CRMMedico}
          />
            </div>

            <div className='flex justify-center items-end w-full gap-3'>
             <h1 className="font-bold text-blue-900"> Endereço: </h1>
             <TextField
             label=""
             variant="standard"
             sx={{ borderBottom: "1px solid blue" }}
             disabled
              className ="w-full"
              required
              value={EnderecoMedico}
             />
            </div>

           </div>

        </div>
     </div>
        </div>

        <div className="flex justify-end p-4">
            <Image
              src={Logo}
              alt="Logo Interconsulta"
              height={40}
              width={40}
              className='animate-spin-slow'
              sx={{ borderRadius: '50%' }}
            />
          </div>
          
        </div>
       
        )   
}
