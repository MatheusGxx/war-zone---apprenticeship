'use client'

import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { config } from '../config'

export const AccordionReuniaoMédico2 = ({
  setReceitaSimples,
  receitaSimples,
  setReceitaControlada,
  receitaControlada,
  setDiasAfastamento,
  diasAfastamento,
  setCID,
  cid,
  setSolicitarExames,
  SolicitarExames,
  IdentificadorConsulta
}) =>{

  useEffect(() => {
    
  },[receitaSimples, receitaControlada, SolicitarExames,IdentificadorConsulta])

    /////////////////////////////// Receita Simples ///////////////////////////////////////////

  const [keySavedReceitaSimples, setKeySavedReceitaSimples] = useState('')

  const queryClient = useQueryClient()

  const SaveReceitaSimples = useMutation(async (valueBody) => { 
    try{
      const response = await axios.post(`${config.apiBaseUrl}/api/saved-receita-simples`, valueBody)
      return response.data
    }catch(error){
      console.log(error)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('ReceitaSimples');
    },
  }
  )

  const HandleAddConsultaSimples = async () => {
    try{
      await SaveReceitaSimples.mutateAsync({id: IdentificadorConsulta, receitaSimples: receitaSimples})
      setReceitaSimples('')
    }catch(error){
      console.log(error)
    }
  }

  const DeleteReceitaSimples = useMutation(async (idReceitaS) =>{
    try{
      const request = await axios.delete(`${config.apiBaseUrl}/api/delete-receita-simples/${IdentificadorConsulta}/${idReceitaS}`)  
      return request.data
    }catch(error){
      console.log(error)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('ReceitaSimples');
    },
  }
  )

  const HandleDeleteConsultaSimples = async (idReceitaS) => {
    try{
      await DeleteReceitaSimples.mutateAsync(idReceitaS)
    }catch(error){
      console.log(error)
    }
  }

  const getReceitaSimples = async () => {
    try{
      const response = await axios.get(`${config.apiBaseUrl}/api/get-receita-simples/${IdentificadorConsulta}`)
      return response.data.receitas
    }catch(error){
      console.log(error)
    }
  }

  const queryKey = ['ReceitaSimples', keySavedReceitaSimples];
  const { data: receitas, isFetching, isError, refetch, isSuccess } = useQuery(
    queryKey,
    () => getReceitaSimples(keySavedReceitaSimples)
  )

  /////////////////////////////// Receita Controlada ///////////////////////////////////////////

  const [keySavedReceitaControlada, setkeySavedReceitaControlada] = useState('')
  
  const SavedReceitaControlada = useMutation(async (valueBody) => { 
    try{
      const response = await axios.post(`${config.apiBaseUrl}/api/saved-receita-controlada`, valueBody)
      return response.data
    }catch(error){
      console.log(error)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('ReceitaControlada');
    },
  }
  )

  const HandleAddConsultaControlada = async () => {
    try{
      await SavedReceitaControlada.mutateAsync({id: IdentificadorConsulta, receitaControlada: receitaControlada})
      setReceitaControlada('')
    }catch(error){
      console.log(error)
    }
  }

  const DeleteReceitaControlada = useMutation(async (idReceitaC) =>{
    try{
      const request = await axios.delete(`${config.apiBaseUrl}/api/delete-receita-controlada/${IdentificadorConsulta}/${idReceitaC}`)  
      return request.data
    }catch(error){
      console.log(error)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('ReceitaControlada');
    },
  }
  )

  const HandleDeleteConsultaControlada = async (idReceitaC) => {
    try{
      await DeleteReceitaControlada.mutateAsync(idReceitaC)
    }catch(error){
      console.log(error)
    }
  }

  const getReceitaControlada = async () => {
    try{
      const response = await axios.get(`${config.apiBaseUrl}/api/get-receita-controlada/${IdentificadorConsulta}`)
      return response.data.receitasControladas
    }catch(error){
      console.log(error)
    }
  }

  const queryKeyC = ['ReceitaControlada', keySavedReceitaControlada];
  const { data: receitasControladas, isFetching: isFetchingC, isError: isErrorC, isSuccess: isSuccessC } = useQuery(
    queryKeyC,
    () => getReceitaControlada(keySavedReceitaControlada)
  )


  ///////////////////////////////// Exames //////////////////////////////////////////////

  const [keyexames, setkeyExames] = useState('')
  
  const SavedExame = useMutation(async (valueBody) => { 
    try{
      const response = await axios.post(`${config.apiBaseUrl}/api/saved-exame`, valueBody)
      return response.data
    }catch(error){
      console.log(error)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('Exames');
    },
  }
  )

  const HandleAddExames = async () => {
    try{
      await SavedExame.mutateAsync({id: IdentificadorConsulta, exame: SolicitarExames })
      setSolicitarExames('')
    }catch(error){
      console.log(error)
    }
  }

  const DeleteExames = useMutation(async (idExame) =>{
    try{
      const request = await axios.delete(`${config.apiBaseUrl}/api/delete-exame/${IdentificadorConsulta}/${idExame}`)  
      return request.data
    }catch(error){
      console.log(error)
    }
  },
  {
    onSettled: () => {
      queryClient.invalidateQueries('Exames');
    },
  }
  )

  const HandleDeleteExames = async (idExame) => {
    try{
      await DeleteExames.mutateAsync(idExame)
    }catch(error){
      console.log(error)
    }
  }

  const getExames = async () => {
    try{
      const response = await axios.get(`${config.apiBaseUrl}/api/get-exame/${IdentificadorConsulta}`)
      return response.data.exames
    }catch(error){
      console.log(error)
    }
  }

  const queryKeyE = ['Exames', keyexames]
  const { data: exames, isFetching: isFetchingE, isError: isErrorE, isSuccess: isSuccessE } = useQuery(
    queryKeyE,
    () => getExames(keyexames)
  )

    return(
      <>
        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary" />}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Prescrição - Receita Simples </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <div className="flex justify-center items-center flex-col gap-3">
          {isSuccess &&  receitas &&  receitas.map((receitasS, index) => (
            <div key={index} className="flex  gap-3 w-full">
               <TextField
             label="Prescrição - Receita Simples"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
             }}
              value={receitasS.ReceitaSimplesSolicitada}
              className = "w-full"
              multiline
              required
             />

             <div className="flex justify-center items-end">              
             <DeleteIcon color="primary" className="cursor-pointer" onClick={() => HandleDeleteConsultaSimples(receitasS._id)}/>
             </div> 

            </div>
          ))}
          <div className="flex gap-3 w-full">
          <TextField
             label="Prescrição - Receita Simples"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
             }}
              onChange={(e) => setReceitaSimples(e.target.value)}
              value={receitaSimples}
              className = "w-10/12"
              multiline
              rows={3}
              required
             />
              
              <div className='flex justify-center items-end' onClick={HandleAddConsultaSimples}>
              <button className='flex gap-3 border-blue-500 border-2 p-2 rounded-xl'>
              <p> Salvar </p> 
              <AddIcon color="primary" className="cursor-pointer" />
             </button>
              </div>
          </div>
          </div>
          </AccordionDetails>
        </Accordion>

        
        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary" />}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Prescrição - Receita Controlada </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <div className="flex justify-center items-center flex-col gap-3">

          {isSuccessC && receitasControladas && receitasControladas.map((receitasC, index) => (
            <div key={index} className="flex  gap-3 w-full">
               <TextField
             label="Prescrição - Controlada"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
             }}
              value={receitasC.ReceitaControladaSolicitada}
              className = "w-full"
              multiline
              required
             />
             <div className="flex justify-center items-end">
             <DeleteIcon color="primary" className="cursor-pointer" onClick={() => HandleDeleteConsultaControlada(receitasC._id)}/>
             </div> 
            </div>
          ))}

            <div className="flex gap-3 w-full">
            <TextField
             label="Prescrição - Receita Controlada"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
             }}
              onChange={(e) => setReceitaControlada(e.target.value)}
              value={receitaControlada}
              className = "w-full"
              multiline={4}
              rows={5}
              required
             />

             
             <div className="flex justify-center items-end"  onClick={HandleAddConsultaControlada}>
              <button className="flex gap-3 border-blue-500 border-2 p-2 rounded-xl">
                <p> Salvar </p>
               <AddIcon color="primary" className="cursor-pointer"/>
              </button>
            </div>

          </div>
          </div>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary"/>}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Atestado </h1>
          </AccordionSummary>
    
        <AccordionDetails className='flex gap-5'>
          <TextField
             label="Dias de Afastamento:"
             variant="standard"
             InputProps={{
                 sx: { borderBottom: "1px solid blue" },
              }}
             onChange={(e) => setDiasAfastamento(e.target.value)}
             value={diasAfastamento}
             className = "w-full"
             required
             type='number'
                />

         <TextField
             label="CID da Doença:"
             variant="standard"
             InputProps={{
                 sx: { borderBottom: "1px solid blue" },
              }}
             onChange={(e) => setCID(e.target.value)}
             value={cid}
             className = "w-full"
             required
                />
          </AccordionDetails>
        </Accordion>

        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h1> Solicitar Exames </h1>
        </AccordionSummary>

        <AccordionDetails>
          
          <div className='flex justify-center items-center w-full flex-col gap-3'>
              
          {isSuccessE && exames && exames.map((examesE, index) => (
            <div key={index} className="flex  gap-3 w-full">
               <TextField
                label="Solicitaçao de Exames"
                variant="standard"
                InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                }}
                  value={examesE.Exame}
                  className = "w-full"
                  multiline
                  required
               />
             <div className="flex justify-center items-end">
             <DeleteIcon color="primary" className="cursor-pointer" onClick={() => HandleDeleteExames(examesE._id)}/>
             </div> 
            </div>
          ))}

           <div className='flex gap-3 w-full'>
             <TextField
               label="Solicitar Exames"
               variant="standard"
               InputProps={{
                sx: { borderBottom: "1px solid blue" },
               }}
               onChange={(e) => setSolicitarExames(e.target.value)}
               value={SolicitarExames}
               className="w-full"
               multiline={4}
               required
           />
              

              <div onClick={HandleAddExames} className="flex justify-center items-end">
                <button className="flex gap-3 border-blue-500 border-2 p-2 rounded-xl">
                  <p> Salvar </p>
                <AddIcon color="primary" className="cursor-pointer"/>
                </button>
              </div>

              </div>  
            </div>
        </AccordionDetails>
      </Accordion>
      </>
    )
}