'use client'
import { useState, useEffect } from 'react';
import ReuniaoMédico from '../../../components/ReuniaoMédico.js';
import ReuniaoTwo from '../../../components/ReuniaoTwo.js';
import ReuniaoNull from '../../../components/ReuniaoNull.js';
import PopUpMédico from '../../../partials/PopUpMédico.js';
import IconNull from '../../../public/IconNull.png';
import secureLocalStorage from 'react-secure-storage';
import Image from 'next/image';
import Logo from '../../../public/logo.png';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link'
import JaasComponent from '@/app/components/Jaas.jsx';
import { config } from '@/app/config.js'

function Room({ params }) {
  const [validator, setValidator] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const Médico = secureLocalStorage.getItem('NomeMedico');
  const Paciente = secureLocalStorage.getItem('NomePaciente');    
  const Unidade = secureLocalStorage.getItem('NomeUnidade');

  const idLocal = secureLocalStorage.getItem('id');
  const id = idLocal || '';

  const getValidatorLink = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/validator-link/${params.id}`);
    return response.data
  };

  const key = ['Validator', validator];
  const { data, isFetching, isError, isSuccess } = useQuery(key, () => getValidatorLink(validator))

  useEffect(() => {
    if(isSuccess){
      
      const loadJitsiScript = async () => {
        const script = document.createElement('script');
        script.src =
          'https://8x8.vc/vpaas-magic-cookie-21c1473964e545b582ea460f6a9d0a94/external_api.js';
        document.body.appendChild(script);
  
        script.onload = () => {
          if (window.JitsiMeetExternalAPI) {
            const api = new window.JitsiMeetExternalAPI("8x8.vc", {
              roomName: "vpaas-magic-cookie-21c1473964e545b582ea460f6a9d0a94/Consultório Médico",
              parentNode: document.querySelector('#jaas-container'),
            });
          } else {
            console.error('JitsiMeetExternalAPI not available');
          }
        };
      };
  
      if (!scriptLoaded) {
        loadJitsiScript()
        setScriptLoaded(true)
      }
    }
  }, [scriptLoaded, isSuccess])

  return (
    <>
      {isFetching && (
        <div className='min-h-screen flex justify-center items-center'>
          <Image src={Logo} alt="Logo Interconsulta Vermelho" height={100} width={100} className='animate-pulse' />
        </div>
      )}
      {isSuccess && (
        <>
          <div className="flex w-full justify-center">
            <div className="w-6/12 flex justify-center flex-col">
            {scriptLoaded &&
            <div
            id="jaas-container"
            className="min-h-[93vh] w-full flex items-center justify-center"
            ></div>
            }
            </div>
            {Médico !== null ? (
              <>
                <PopUpMédico />
                <ReuniaoMédico />
              </>
            ) : null}
            {Paciente !== null && <ReuniaoTwo />}
            {Médico === null && Paciente === null && <ReuniaoNull />}
          </div>
        </>
      )}

      {isError && (
        <>
          <div className='min-h-[80vh] flex justify-center items-center gap-5 flex-col'>
            <div className='flex gap-5'>
              <Image src={IconNull} width={50} height={50} alt="Icon Null" />
              <h1 className='text-2xl text-red-600 font-bold'> Ops Infelizmente o Link dessa Reunião Expirou =/</h1>
            </div>
            
            <Link href="/agenda">
            <button className='p-2 bg-blue-600 rounded-xl'>
                <p className='text-white font-bold'> Voltar Para a Agenda </p>
            </button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default Room