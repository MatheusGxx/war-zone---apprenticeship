import { TextField } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios' 
import EditIcon from '@mui/icons-material/Edit';
import { config } from '../config.js'

export const SolicitaçaoExames = ({ date, 
    nomePaciente,
    nomeMedico,
    CRMMedico,
    UFMedico,
    EstadoMedico,
    BairroMedico,
    CidadeMedico,
    SolicitarExames,
    IdentificadorConsulta,
 }) => {

   const [keyexames, setKeyExames] = useState('')
   const [editavel, setEditavel] = useState({})

   const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      setEditavel(prevState => ({
        ...prevState,
        [index]: {
          ...prevState[index],
          [name]: value
        }
      }));
    }
    
   const queryClient = useQueryClient()

   const EditExame = useMutation(async (idExame) => { 
      try{
        const response = await axios.put(`${config.apiBaseUrl}/api/edit-exame/${idExame}`)
        return response.data
      }catch(error){
        console.log(error)
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('EditExames');
      },
    }
    )
   
    const HandleEditExame =  async (idExame) => {
     await EditExame.mutateAsync(idExame)
    }
      
   const getExames = async () => {
      try{
      const response = await axios.get(`${config.apiBaseUrl}/api/get-exame/${IdentificadorConsulta}`)
      return response.data.exames
      }catch(error){
      console.log(error)
      }
   }

   const queryKeyE = ['EditExames', keyexames]
   const { data: exames, isFetching: isFetchingE, isError: isErrorE, isSuccess: isSuccessE } = useQuery(
      queryKeyE,
      () => getExames(keyexames)
   )
    
    return(
        <>
        <div className='mt-5'>
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

        {isSuccessE && exames && exames.map((examesE, index) => (
         <div key={index} className="flex justify-center items-center gap-3 w-full">
            <TextField
                  label="Exame"
                  variant="outlined"
                  InputProps={{
                     sx: { border: "1px solid blue" },
                     readOnly: true,
                  }}
                  name="Exame"
                  value={examesE.Exame}
                  className="w-full"
                  
                  multiline
                  rows={2}
                  required
                  />
                  <EditIcon
                  color="primary"
                  className="cursor-pointer"
                  onClick={() => HandleEditExame(examesE._id)}
                  />
            </div>
          ))}

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