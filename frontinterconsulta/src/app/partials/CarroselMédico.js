'use client'
import React from 'react';
import Image from 'next/image';

export const MedicoCarousel = ({ successData }) => {
  return (
      <div className='w-full mt-10 mb-10'>
      {successData && successData.length > 0 ? (

        successData.map((medico, index) => (
          <div key={index} className="cursor-pointer flex flex-col justify-center items-center">
            <div className="sm:flex flex justify-center sm:justify-center mb-4">
              <Image src={`${config.apiBaseUrl}/${medico.Foto}`} alt={`Foto do Médico ${medico.NomeEspecialista}`} width={150} height={150} className="sm:rounded-full rounded-xl" />
            </div>
            <div className="flex gap-3 justify-center items-center">
              <p className="sm:text-center text-center text-blue-500 font-bold white">{medico.NomeEspecialista}</p>
              <div className="mt-1">
                <div className="bg-red-500 rounded-full h-2 w-2"></div>
              </div>
            </div>
            <div className="flex justify-center items-center flex-col">
              <p className="text-center sm:text-center text-blue-900">{medico.EspecialidadeMedica}</p>
              <p className="text-center sm:text-center text-blue-900">{medico.AreadeAtuacao}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum Médico disponível</p>
      )}
    </div>
    
  )
}
