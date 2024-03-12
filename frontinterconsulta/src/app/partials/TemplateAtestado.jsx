import HealingIcon from '@mui/icons-material/Healing'
import { TextField, Box } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const TemplateAtestado = ({
  NomeMedico,
  CRMMedico, 
  NomePaciente, 
  CPFPaciente,
  Localidade,
  date,
  data,
  index,
  HandleChangeDiasAfastados,
  HandleChangeCID,
}) => {
  return(
    <Box
      className="border-blue-500 border-4 rounded-lg p-6"
      sx={{
        borderColor: 'blue.500',
        p: 6,
        borderRadius: 'lg',
      }}
    >
      <Box className='flex justify-center items-center gap-5 mb-10'>
        <h1 className="font-bold text-blue-900 text-2xl"> Atestado {index + 1} </h1>
        <HealingIcon color="primary"/>
      </Box>

      <Box className='w-full flex justify-start flex-col'>

        <Box className='w-full flex gap-3'>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h1 className='font-bold text-blue-900 white'>
              Eu, {NomeMedico}, CRM: {CRMMedico}, atesto para os devidos fins que o(a) paciente {NomePaciente}, portador(a) do CPF: {CPFPaciente}, necessita de afastamento de suas
            </h1>
            <TextField
              label="Número de dias"
              variant="standard"
              size="small"
              autoComplete="off"
              autoFocus
              id="dias-afastados"
              name="dias-afastados"
              type='number'
              inputProps={{
                min: 1,
                max: 365,
                style: {
                  textAlign: "center", // Centraliza o texto horizontalmente
                },
              }}
              InputLabelProps={{ shrink: true }}
              helperText="Insira o número de dias de afastamento"
              defaultValue={data.DiasDeAtestado}
              onChange={(e) => HandleChangeDiasAfastados(e.target.value)}
              disabled={data.DiasDeAtestado !== null}
              readOnly={data.DiasDeAtestado !== null}
            />
            <h1 className='font-bold text-blue-900 white'>
              atividades laborais pelo período de
            </h1>
          </Box>
        </Box>

        <Box className='flex justify-center items-end w-full gap-3 mt-10'>
          <h1 className='font-bold text-blue-900'> CID: </h1>
          <TextField
            label="CID"
            variant="standard"
            size="small"
            id="cid"
            name="cid"
            type='text'
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
            defaultValue={data.CID}
            onChange={(e) => HandleChangeCID(e.target.value)}
          />
       </Box> 

      </Box>

      <h1 className='font-bold text-blue-900 mt-10'> Local e Data: {Localidade}, {date} </h1>

      <Box className='w-full flex justify-start flex-col mt-10'> 
        <h1 className='font-bold text-blue-900'> {NomeMedico} </h1>
        <h1 className='font-bold text-blue-900'> {CRMMedico}</h1>
      </Box>

      <Box className="flex justify-end p-4">
        <Image
