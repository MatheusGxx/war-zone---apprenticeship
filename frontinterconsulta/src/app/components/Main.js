import secureLocalStorage from 'react-secure-storage'
import { ButtonBlood } from './ButtonBlood.js'

const Main = ({ title, subTitle, Component }) => {
  const NomePacienteLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false
  const NomePaciente = NomePacienteLocal ?? ''

  return (
    <>
      <main className="flex-1 bg-blue-100 p-8 flex items-center flex-col gap-8 lg:flex justify-center lg:items-center lg:p-4">

        <section className="flex flex-col gap-2 justify-center md:pr-0 lg:pr-0 xl:pr-0 sm:flex-col">

          <div className='flex gap-5 w-full sm:flex-col md:flex-col lg:flex-col xl:flex-col'>
            <h2 className="text-3xl font-bold text-blue-900 sm:text-base 
          sm:whitespace-pre-wrap md:whitespace-nowrap lg:text-2xl
          md:text-center xl:text-center whitespace-nowrap">
              {NomePaciente} {title}
            </h2>
            <div 
              className='sm:flex sm:justify-center sm:items-center
           md:flex md:justify-center md:items-center 
           lg:flex lg:justify-center lg:items-center
           xl:
