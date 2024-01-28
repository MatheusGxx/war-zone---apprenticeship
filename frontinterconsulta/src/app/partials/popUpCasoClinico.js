import { forwardRef, useState, useEffect } from 'react';
import { 
  Dialog,
  AppBar, 
  Toolbar, 
  Slide,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Logo from '../public/logo.png';
import ApartmentIcon from '@mui/icons-material/Apartment';
import TodayIcon from '@mui/icons-material/Today';
import WcIcon from '@mui/icons-material/Wc';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AddAlertIcon from '@mui/icons-material/AddAlert'
import CakeIcon from '@mui/icons-material/Cake'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import CoPresentIcon from '@mui/icons-material/CoPresent'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import secureLocalStorage from 'react-secure-storage'
import { config } from '../config.js'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const CasosClinico = ({
  onClose,
  CasoClinicoPaciente,
  CPF,
}) => {

  const[open, setOpen] = useState(false)
  const[quantidade, setQuantidade] = useState('')
  const[nomePaciente, setNomePaciente] = useState('')
  const[idade, setIdade] = useState('')
  const[sexo, setSexo] = useState('')
  const[estadoCivil, setEstadoCivil] = useState('')
  const[profissão, setProfissão] = useState('')

  useEffect(() => {
    handleClickOpen();
  }, [])

  useEffect(() => {
   if(CPF){
    const body = {
      CPF: CPF
    }
    Paciente.mutateAsync(body)
   }

  }, [CPF, CasoClinicoPaciente])

  const handleClickOpen = () => setOpen(true);

  const handleClickClose = () => {
    setOpen(false)
    onClose()
  }

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const Paciente = useMutation(async (body) => {
    try {
      const request = await axios.post(`http://${config.apiBaseUrl}/api/get-historic-patient`, body)
       setNomePaciente(request.data.Pacientee.nome)
       setIdade(request.data.Pacientee.Idade)
       setSexo(request.data.Pacientee.Genero)
       setEstadoCivil(request.data.Pacientee.EstadoCivil)
       setProfissão(request.data.Pacientee.Profissao)
       setQuantidade(request.data.HistoricoCasosClinicosAtualizados.length)
      return request.data.HistoricoCasosClinicosAtualizados
    } catch (error) {
      console.error("Erro ao buscar Histórico do Paciente", error)
      throw new Error
    }
  })

  const Medico = useMutation(async (body) => {
    try {
      const request = await axios.post(`http://${config.apiBaseUrl}/api/get-data-doctor`, body)
      return request.data
    } catch (error) {
      console.error("Erro ao buscar a Foto do Médico", error)
      throw new Error
    }
  })

  useEffect(() =>{
      const body = {
        idMedico: id
      }
      Medico.mutateAsync(body)
  },[])


  const CMRMédico = secureLocalStorage.getItem('CRMMedico')
  const CRM = CMRMédico || ''

  const NomeMedicoLocal = secureLocalStorage.getItem('NomeMedico')
  const NomeMedico = NomeMedicoLocal || ''


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
            <CloseIcon
              edge="start"
              color="primary"
              onClick={handleClickClose}
              aria-label="close"
              className="cursor-pointer"
            />
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

        </div>
        
    
        {Paciente.isLoading  ?
        <div className='flex-1 flex items-center justify-center'>
        <Image src={Logo} width={150} height={150} alt="Logo Interconsulta" className='animate-bounce'/>
        </div>
        :
        <>
        {quantidade ? 
            <h1 className='font-bold text-2xl text-blue-900 p-5 text-center sm:text-xl'> Linha da Vida: ({quantidade})</h1>
          :  
          <h1 className='font-bold text-2xl text-blue-900 p-5 text-center sm:text-xl'> Paciente nao contem uma Linha de Vida</h1>
        }

        {Paciente.data ?
          Paciente.data.map((data, outerIndex) => (
            <div key={outerIndex} className='pt-5 bg-white flex flex-col gap-10 items-center pb-5'>
            
                <div key={outerIndex} className='border-blue-500 border-4 rounded-lg p-5 w-1/3 sm:w-10/12'>


                  {CRM === data.CRMMedicoAtendeu ? 
                  <>
                  <div className="w-full flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center gap-5">
                    <Image
                        src={`http://${config.apiBaseUrl}/${Medico.isSuccess ? Medico.data.FotoMédico : ''}`}
                        alt="Foto do Médico"
                        width={50}
                        height={50}
                        className="sm:rounded-full rounded-full"
                      />
                    <p className='text-blue-500'>{NomeMedico} Voce que atendeu esse caso!</p>
                    </div>
                    <div className='flex gap-5  justify-cente items-center'>
                     <div className="bg-green-500 rounded-full h-3 w-3"></div>
                     <h1 className='font-bold text-blue-900 text-2xl text-center'>
                    Caso Clinico: {outerIndex+ 1}</h1>
                    </div>
                  </div>
                  </>
                  :
                  <h1 className='font-bold text-blue-900 text-2xl text-center'> 
                  Caso Clinico: {outerIndex+ 1}
                  </h1>
                  }
  
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
                      <h2> Unidade de Saude: Atendimeto Particular</h2>
                    </div>
                    <div className='flex gap-2'>
                      <LocalHospitalIcon color='primary' />
                      <h2> Especialidade: {data.Especialidade}</h2>
                    </div>
                    <div className='flex gap-2'>
                      <HealthAndSafetyIcon color='primary' />
                      <h2> Área de Atuação: {data.AreaAtuacao}</h2>
                    </div>
                    <div className='flex gap-2'>
                      <AddAlertIcon color="primary" />
                      <h2> Solicitação: {data.Solicitacao}</h2>
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
                      <h2> Status do Caso Clinico: {data.EstadoPaciente}</h2>
                    </div>
                  </div>
  
                  <div className="flex justify-end">
                    <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow'/>
                  </div>
  
                </div>
            </div>
          ))
         :
         <>
          <h1 className='text-center text-blue-600 font-bold text-2xl sm:text-xl'>No momento o paciente {nomePaciente} nao contem Historico, pois nao passou em nenhuma consulta!</h1>
         </>  
         }
        </>
        }

     

      

      </Dialog>
    </>
  );
};
