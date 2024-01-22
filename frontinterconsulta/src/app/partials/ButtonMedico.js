'use client'
import { useState, useEffect} from "react"
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { NotLogged } from "./NotLoggedPopUp"
import PopUpMedicoHoras from "./PopUpHorasMedico"
import HorariosMedicos from "./HorariosMedico"
import { useHistorico } from "../context/context"
import secureLocalStorage from 'react-secure-storage'

export const ButtonMedico = () => {
  const [notLogged, setNotLogged] = useState(false);
  const [logguedYesHorario, setLogguedYesHorario] = useState(false);
  const [logguedNotHorarios, setLogguedNotHorarios] = useState(false);
  const [verify, setVerifyMedico] = useState([]);
  const { historico } = useHistorico();

  const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false;
  const id = idLocal || ""

  const VerificaçaoMedica = async () => {
    const Token = typeof window !== 'undefined' ? secureLocalStorage.getItem('token') : false;
  
    if (Token === null) {
      setNotLogged(true)
    } else {
      await CreateRequestMutation.mutateAsync();
  
      if (verify.length === 0) {
        setLogguedNotHorarios(true);
      } else {
        setLogguedYesHorario(true);
      }
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      await CreateRequestMutation.mutateAsync();
      if (verify.length === 0 && notLogged === false) {
        setLogguedNotHorarios(true)
      }else{
        setLogguedYesHorario(true)
      }
    };

    fetchData();
  }, [verify.length, notLogged]);

  const CreateRequestMutation = useMutation(async () => {
    const response = await axios.post(`http://localhost:8080/api/verify-medico/${id}`);
    setVerifyMedico(response.data.QueryHorariosMedico);
    return response.data;
  })

  return (
    <>
      <div className="sm:flex sm:justify-center sm:items-center sm:w-full">
        <button className='w-52 h-10 bg-indigo-950 rounded-full font-bold text-white  sm:p-1 sm:w-1/2' onClick={VerificaçaoMedica}>
          <p className='sm:text-sm text-center xl:w-full'>{historico.length > 0 ? 'Seus Horarios' : 'Cadastrar Horarios'}</p>
        </button>
      </div>

      {logguedNotHorarios && notLogged === false && verify.length === 0 && <PopUpMedicoHoras onClose={() => setLogguedNotHorarios(false)} />}
      {logguedYesHorario && verify.length > 0 && <HorariosMedicos onClose={() => setLogguedYesHorario(false)} />}
      {notLogged && 
      <NotLogged
       onClose={() => setNotLogged(false)}
       messageOne="Atenção Dr(a)!!!"
       messageTwo="Você nao esta logado faça login para preencher cadastrar os horarios e ver todos os nossos casos clinicos clicando no botao abaixo!" />}
    </>
  );
}