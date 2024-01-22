'use client'
import React, { useState, useEffect } from "react";
import { 
   Dialog,
   DialogContent, 
   DialogActions, 
   DialogTitle, 
   TextField , 
   Snackbar , 
   Alert } from "@mui/material"
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"
import secureLocalStorage from 'react-secure-storage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Checkout } from "../components/Checkout.jsx"
import { AgendamentoComponente } from "../components/AgendamentoComponent.jsx"
import { parse, isBefore, compareAsc } from 'date-fns'

const AgendamentoConsulta = ({ 
  EspecialidadeMedica,
  titleButon, 
  DoencaAutoComplete, 
  SlugRoute, 
  NomeMedico, 
  Horarios, 
  idMedico,
  ValorConsulta,
  FotoMedico,
  avaliacoes,
  onClose
}) => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const [snackbarOpen2, setSnackbarOpen2] = useState(false)
  const [snackbarMessage2, setSnackbarMessage2] = useState("")
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  })

  const { vertical, horizontal } = position

  const [doenca, setDoenca] = useState('')
  const [datas, setDatas] = useState([])
  const [inicio, setInicio] = useState(null)
  const [fim, setFim] = useState(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [visibleData, setVisibleData] = useState(true)
  const [visibleHorarios, setVisibleHorarios] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedIntervals, setSelectedIntervals] = useState(null)
  const [HorarioMarcado, setHorarioMarcado] = useState(false)
  const [intervaloTotal, setIntervaloTotal] = useState(null)
  const [checkout, setCheckout] = useState(false)
  const [idHorario, setIDHorario] = useState(null)
  const [formasPagamento, setPagamento] = useState(null)
  const [agendamento, setAgendamento] = useState(true)
  const [readOnlyMode, setReadOnlyMode] = useState(true)
  const [fotoPaciente, setFotoPaciente] = useState(null)
  const [checkboxSelecionado, setCheckboxSelecionado] = useState(null)
  const [resumo, setResumo] = useState('')
  const [selectOneDate, setSelectOneDate] = useState(false)
  const [notIntervals, setNotIntervals] = useState(null)
  const [tempoConsulta, setTempoConsulta] = useState(null)

  const CadastroFinalSucess = secureLocalStorage.getItem('CadastroEndSucess')

  const Route = usePathname()

  const RouteEspecialistaDisponiveis = Route === '/especialistas-disponiveis'

  const Navigation = useRouter()

  const DoencaLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('Doenca') : false
  const Doenca = DoencaLocal || ''

  const DoencaInputAutocomplete = DoencaAutoComplete ? DoencaAutoComplete : ''

  const idLocal = secureLocalStorage.getItem('id') 
  const id = idLocal || ''

  const NameLocalPaciente = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false

  const NamePaciente = NameLocalPaciente || ''

  const Resumo = secureLocalStorage.getItem('Sintoma')

  useEffect(() => {
    setResumo(Resumo || '')
  }, []);

  useEffect(()  =>{
   handleOpenClick()
  },[])

   useEffect(() => {
      if(Doenca){
        setDoenca(Doenca)
      }else{
        setDoenca('')
      }
   },[Doenca])

   useEffect(() =>{
     if(DoencaInputAutocomplete){
        setDoenca(DoencaInputAutocomplete)
     }
   },[DoencaInputAutocomplete])

   useEffect(() => {
    
   },[Horarios])

   const getPhotoPaciente = useMutation(async (valueRequest) => {
    try {
      const response = await axios.post('http://localhost:8080/api/foto-paciente', valueRequest)
      setFotoPaciente(response.data.FotoPaciente);
      return response.data.FotoPaciente
    } catch (error) {
      throw new Error(`Error fetching photo: ${error}`);
    }
  });

useEffect(() => {
  const FetchData = async () => {
    try {
     if(Horarios.length > 0){
      const body = {
        id: idLocal,
      }

      await getPhotoPaciente.mutateAsync(body)
     }
    } catch (error) {
      console.error("React Query Error:", error)
    }
  };

  FetchData();
}, [idLocal])


   const AgendamentoMarcado = useMutation(async (valueRequest) =>{
    const request = axios.post('http://localhost:8080/api/agendamento-paciente-particular', valueRequest)
    return request.data
   })
 

  const RoutePush = () =>{
    if(RouteEspecialistaDisponiveis){ // só acontece na rota de Especialistas Disponiveis se o usuario tiver Logado
      Doenca && id
      ? 
      Navigation.push(`/especialista/${SlugRoute}`)
      :
      Navigation.push(`/especialista/${SlugRoute}`)
    }
  }
  

  const handleOpenClick = () => {
    setOpen(true)
  }

  const handleCloseClick = () => {
    setOpen(false)
    if(CadastroFinalSucess){
      secureLocalStorage.removeItem('CadastroEndSucess')
    }

    if(Resumo){
      secureLocalStorage.removeItem('Sintoma')
    }
      RoutePush()
  }

  const HandleClickFinal = async () => {
      
   const body = {
    IDPaciente: id,
    IDMedico: idMedico,
    Caso: doenca,
    Data: selectedDate,
    Inicio: inicio,
    Fim: fim,
    Solicitante: NamePaciente,
    Solicitado: NomeMedico,
    Status: 'Paciente Aguardando',
    HorarioSelecionado: horarioSelecionado,
    Escolhido: `Escolhido pelo Paciente ${NamePaciente}`,
    idHorario: idHorario,
    TempoConsulta: tempoConsulta,
    Resumo: resumo,
   }

    try{
      await AgendamentoMarcado.mutateAsync(body)
      setIDHorario(null)
      setSnackbarMessage2(`${NamePaciente} sua consulta foi marcada com ${NomeMedico}, voce pode acompanhar o status dela pela sua Agenda!`)
      handleSnackBarOpen2()
      setHorarioMarcado(true)
      setOpen(false)
      setTimeout(() => {
        Navigation.push('/agenda')
      },2000)
    }catch(e){
      setSnackbarMessage(`Houve erro ao Tentar Agendar a sua Consulta com ${NomeMedico}`)
      handleSnackBarOpen()
    }
  }

  const HandleClickEnd = () =>{
    if(selectedDate.length === 0 || resumo === '' || selectedIntervals.length === 0){
      setSnackbarMessage("Ops, Voce nao preencheu todos os campos para agendar a sua consulta =/");
      handleSnackBarOpen()
    }else if (HorarioMarcado === true){
         setSnackbarMessage(`${NamePaciente}, Voce acabou de Agendar com o ${NomeMedico}, nao é possivel Agendar Novamente!`)
         handleSnackBarOpen()
    }else{
       HandleClickFinal()
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  };

  const handleSnackBarOpen = () =>{
    setSnackbarOpen(true)
  }

  const handleSnackbarClose2 = () => {
    setSnackbarOpen2(false); 
  };

  const handleSnackBarOpen2 = () =>{
    setSnackbarOpen2(true)
  }

  const onChangeCheckBoxDate = (e, id) => {

    if(e.target.checked){
      const selectedDateObj = Horarios.find((horario) => horario._id === id)
      setTempoConsulta(selectedDateObj.TempoDeConsulta)
      setIDHorario(id)
    
      if (selectedDateObj) {

        const now = new Date()

        const getFilteredIntervals = (selectedDateObj, now) => {
          const Data = selectedDateObj.data;
        
          if (compareAsc(parse(Data, 'dd/MM/yyyy', new Date()), now) > 0) {
            // Se a data selecionada for maior que a data atual, exibe todos os intervalos livres
            return selectedDateObj.IntervaloAtendimentos.filter(
              (intervalo) => intervalo.Escolhido === 'Livre'
            );
          } else {
            // Caso contrário, filtra os intervalos que estão após o horário atual
            const intervalsLivres = selectedDateObj.IntervaloAtendimentos.filter(
              (intervalo) => intervalo.Escolhido === 'Livre'
            );
        
            return intervalsLivres.filter((intervalo) => {
              const inicio = parse(intervalo.Intervalo.split(' - ')[0], 'HH:mm', now);
              const isAfterInicio = isBefore(now, inicio);
              return isAfterInicio;
            });
          }
        }

        const intervalsAtuais = getFilteredIntervals(selectedDateObj, now)

        //Nao tem Intervalos Disponivel na data selecionada
        if (intervalsAtuais.length === 0) {
           setNotIntervals(false)
        } 
          
        const Intervalo = intervalsAtuais.map((data) => data.Intervalo)
        
          setSelectedDate(selectedDateObj.data)
          setSelectedIntervals(Intervalo)
          setVisibleHorarios(true)
          setCheckboxSelecionado(id)
          setSelectOneDate(true)
        
      }
    }else{
      setSelectedDate(null)
      setCheckboxSelecionado(null)
      setSelectedIntervals(null)
      setVisibleHorarios(false)
      setHorarioSelecionado('')
      setSelectOneDate(true)
      setNotIntervals(null)
      setIDHorario(null)
      setTempoConsulta(null)
    }
  }

  const HandleSelectHorario = (interval) => {
     setHorarioSelecionado(interval)
     setVisibleHorarios(false)

     const PrimeiroCampoIntervalo = interval.split(' - ')
     setInicio(PrimeiroCampoIntervalo[0])
     setFim(PrimeiroCampoIntervalo[1])
  }

  const VerificationOne = () => {
    if(selectedDate.length === 0 || resumo === '' || selectedIntervals.length === 0){
      setSnackbarMessage("Ops, Voce nao preencheu todos os campos para agendar a sua consulta =/");
      handleSnackBarOpen()
      if(CadastroFinalSucess){
        secureLocalStorage.removeItem('CadastroEndSucess')
      }
    }else{
      if(CadastroFinalSucess){
        secureLocalStorage.removeItem('CadastroEndSucess')
        secureLocalStorage.removeItem('Sintoma')
        setAgendamento(false)
        setCheckout(true)
      }else{
        setAgendamento(false)
        setCheckout(true)
      }
    }
  }

  const HandleCheckout = () => {
    if(checkout === true){
      HandleClickEnd()
    }
    if(Horarios.length > 0 ){
       VerificationOne()
    }else{
      if(CadastroFinalSucess){
        onClose()
        setOpen(false)
        secureLocalStorage.removeItem('CadastroEndSucess')
        secureLocalStorage.removeItem('Sintoma')
        window.location.reload()
      }else{
        onClose()
        setOpen(false)
      }
  }
}

  React.useEffect(() => {
     setOpen(true)
  },[])

  return (
    <>
     <Dialog
     open={open}
     onClose={handleCloseClick}
     PaperProps={{
       style: {
         maxWidth: '800px', 
         width: '100%',
       },
     }}
   >
     <div className="flex justify-center">
       <DialogTitle>
         <Image
         src={Logo2}
         alt="Logo 2 Interconsulta"
         height={200}
         width={220}
         />
       </DialogTitle>
       </div>
       <DialogContent>


        {Horarios.length > 0 ?
         <>
          {agendamento && 
            <AgendamentoComponente
            setDoenca={setDoenca}
            doenca={doenca}
            Horarios={Horarios}
            visibleData={visibleData}
            NomeMedico={NomeMedico}
            onChangeCheckBoxDate={onChangeCheckBoxDate}
            selectedDate={selectedDate}
            visibleHorarios={visibleHorarios}
            NamePaciente={NamePaciente}
            selectedIntervals={selectedIntervals}
            HandleSelectHorario={HandleSelectHorario}
            setSelectedDate={setSelectedDate}
            horarioSelecionado={horarioSelecionado}
            setHorarioSelecionado={setHorarioSelecionado}
            especialidade={EspecialidadeMedica}
            setResumo={setResumo}
            resumo={resumo}
            FotoPaciente={fotoPaciente ? fotoPaciente : null}
            checkboxSelecionado={checkboxSelecionado}
            Sintoma={Resumo}
            selectOneDate={selectOneDate}
            notIntervals={notIntervals}
            nomePaciente={NamePaciente}
            />
         }      
         </> 
         : 
         <>
          {Horarios.length === 0 &&
          <>
          <h1 className='font-bold text-blue-500 text-center'>
          {NamePaciente}, o(a) {NomeMedico} nao possui Horarios disponiveis para te atender atualmente
           </h1>
          </>
         }
         </>
         }
           {checkout ?  
            <Checkout
            FotoMedico={FotoMedico}
            avaliacoes={avaliacoes}
            readOnlyMode={readOnlyMode}
            Doenca={Doenca}
            NamePaciente={NamePaciente}
            NomeMedico={NomeMedico}
            ValorConsulta={ValorConsulta}
            setPagamento={setPagamento}
            formasPagamento={formasPagamento}
            idMedico={idMedico}
            />
           :
          null
         }

         </DialogContent>
       <DialogActions className="flex justify-center items-center">
       <div className="flex justify-center items-center">
         <button  className="w-72 h-12 rounded-full bg-red-600 text-white font-light"
          onClick={HandleCheckout}>
            <p className="font-bold text-white">
            {Horarios.length > 0 ? titleButon : 'Escolher outro Médico'} 
          {AgendamentoMarcado.isError && 'Erro ao Agendar'}
            </p>
         </button>
       </div>
       </DialogActions>

       <div className="flex justify-end p-4">
         <Image
         src={Logo}
         alt="Logo Interconsulta"
         height={40}
         width={40}
         className="animate-spin-slow"
         />
       </div>
     </Dialog>
  
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarOpen2}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose2}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose2} severity="success">
          {snackbarMessage2}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AgendamentoConsulta




