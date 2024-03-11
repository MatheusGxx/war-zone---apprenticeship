import { forwardRef, useState, useEffect } from 'react';
import { 
  Dialog,
  AppBar, 
  Toolbar, 
  Slide,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import Logo from '../public/logo.png';
import ApartmentIcon from '@mui/icons-material/Apartment';
import TodayIcon from '@mui/icons-material/Today'
import WcIcon from '@mui/icons-material/Wc';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AddAlertIcon from '@mui/icons-material/AddAlert'
import CakeIcon from '@mui/icons-material/Cake'
import SickIcon from '@mui/icons-material/Sick';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import CoPresentIcon from '@mui/icons-material/CoPresent'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { config } from '../config.js'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const CasosClinicoReuniao = ({
  onClose,
  CPF,
}) => {

  const[open, setOpen] = useState(false)
  const[quantidade, setQuantidade] = useState('')
  const[nomePaciente, setNomePaciente] = useState('')
  const[idade, setIdade] = useState('')
  const[sexo, setSexo] = useState('')
  const[estadoCivil, setEstadoCivil] = useState('')
  const[profissão, setProfissão] = useState('')
  const[queixaAtual, setQueixaAtual] = useState(null)

  useEffect(() => {
    handleClickOpen();
  }, [])

  useEffect(() => {
    if (CPF) {
      const body = {
        CPF: CPF
      }
      Paciente.mutateAsync(body)
    }
  }, [CPF])

  const handleClickOpen = () => setOpen(true);

  const handleClickClose = () => {
    setOpen(false);
    onClose();
  }

  const Paciente = useMutation(async (body) => {
    try {
      const request = await axios.post(`${config.apiBaseUrl}/api/get-historic-patient`, body)
       setNomePaciente(request.data.Pacientee.nome)
       setIdade(request.data.Pacientee.Idade)
       setSexo(request.data.Pacientee.Genero)
       setEstadoCivil(request.data.Pacientee.EstadoCivil)
       setProfissão(request.data.Pacientee.Profissao)
       setQuantidade(request.data.HistoricoCasosClinicosAtualizados.length)
       setQueixaAtual(request.data.Pacientee.ConsultasSolicitadasPacientes.map((data) => data.Resumo))
  
      return request.data.HistoricoCasosClinicosAtualizados
    } catch (error) {
      console.error("Erro ao buscar Histórico do Paciente", error);
      throw new Error
    }
  })

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'white' }}>
          <Toolbar>
            <div className="flex justify-center items-center cursor-pointer" onClick={handleClickClose}>
            <ArrowBackIcon
              edge="start"
              color="primary"
              aria-label="close"
            />
            <h1 className="text-lg text-blue-600 ml-3 animate-pulse"> VOLTAR </h1>
            </div>
            <div className='flex justify-center items-center flex-grow'>
              <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow'/>
            </div>
          </Toolbar>
        </AppBar>
      
        <div className='p-5 bg-white'>
          <h1 className='text-center font-bold text-2xl text-blue-900 pb-10 pt-5'>Ficha do Paciente {nomePaciente} </h1>

          <div className='flex justify-center items-center gap-10'>

            <div className="flex flex-col gap-5">

              <div className='flex gap-2'>
                <CakeIcon color="primary"/>
                <h2>Idade: {idade} </h2>
              </div>

              <div className="flex gap-2">
                <WcIcon color="primary"/>
                <h2>Sexo: {sexo}</h2>
              </div>

            </div>

            <div className="flex flex-col gap-5">

              <div className='flex gap-2'>
                <AccountBalanceIcon color="primary"/>
                <h2>Estado Civil: {estadoCivil} </h2>
              </div>

              <div className='flex gap-2'>
                <CoPresentIcon color="primary"/>
                <h2> Profissão: {profissão} </h2>
              </div>

            </div>

          </div>

          <div className='flex flex-col justify-center items-center pt-10 gap-7'>
            <h1 className='text-center font-bold text-blue-900 text-2xl'>
               Queixa Atual:
           </h1>

           <div className='flex justify-center items-center gap-5'>
            <SickIcon color="primary"/>
            <h1> {queixaAtual} </h1>
           </div>
          </div>

        </div>
        
        {quantidade ? 
            <h1 className='font-bold text-2xl text-blue-900 p-5 text-center sm:text-xl'> Linha da Vida: ({quantidade})</h1>
          :  
          <h1 className='font-bold text-2xl text-blue-900 p-5 text-center sm:text-xl'> Paciente nao contem uma Linha de Vida</h1>
        }
    
        {Paciente.isLoading &&
        <div className='flex-1 flex items-center justify-center'>
        <Image src={Logo} width={150} height={150} alt="Logo Interconsulta" className='animate-bounce'/>
        </div>
        }

        {Paciente.data &&
          Paciente.data?.map((data, outerIndex) => (
            <div key={outerIndex} className='pt-5 bg-white flex flex-col gap-10 items-center pb-5'>
            
                <div key={outerIndex} className='border-blue-500 border-4 rounded-lg p-5 w-1/3 sm:w-10/12'>
              
                  <h1 className='font-bold text-blue-900 text-2xl text-center'> Caso Clinico: {outerIndex+ 1}</h1>
  
                  <div className='flex gap-2 justify-start items-center'>
                    <TodayIcon color='primary' fontSize='large' />
                    <div className='flex justify-center items-center'>
                      <h2 className='font-bold text-blue-500 text-xl'> {data.DataInsercao}</h2>
                    </div>
                  </div>
  
                  <div className="flex flex-col gap-5">
  
                    <div className='flex justify-center items-center'>
                      <h1 className="font-bold text-xl text-blue-900 pt-5"> Informações do Atendimento:</h1>
                    </div>
  
                    <div className="flex gap-2">
                      <ApartmentIcon color="primary" />
                      <h2> Unidade de Saude: {data.UnidadeSaude}</h2>
                    </div>
                    <div className='flex gap-2'>
                      <LocalHospitalIcon color='primary' />
                      <h2> Especialidade: {data.Especialidade}</h2>
                    </div>
                    <div className='flex gap-2'>
                      <HealthAndSafetyIcon color='primary' />
                      <h2> Área de Atuação: {data.SubEspecialidade}</h2>
                    </div>
                    <div className='flex gap-2'>
                      <AddAlertIcon color="primary" />
                      <h2> Solicitação: {data.TipoSolicitaçao}</h2>
                    </div>
  
                  </div>
  
                  <div>
                    <div className='flex justify-center items-center'>
                      <h1 className="font-bold text-xl text-blue-900 pt-5 pb-5 flex items-center "> Resumo do Caso Clinico </h1>
                    </div>
                    <div className="flex gap-2">
                      <MedicalInformationIcon color="primary" />
                      <div>
                        <h2 className='whitespace-break-spaces'>{data.ResumoCasoClinico}</h2>
                      </div>
                    </div>  
                  </div>
  
                  <div>
                    <div className='flex justify-center items-center'>
                      <h1 className="font-bold text-xl text-blue-900 pt-5 pb-5"> Status do Caso Clinico:</h1>
                    </div>
                    <div className="flex gap-2">
                      <CrisisAlertIcon color='primary' />
                      <h2> Status do Caso Clinico: {data.StatusPaciente}</h2>
                    </div>
                  </div>
  
                  <div className="flex justify-end">
                    <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow'/>
                  </div>
  
                </div>
            </div>
          ))
         }

      </Dialog>
    </>
  );
};
