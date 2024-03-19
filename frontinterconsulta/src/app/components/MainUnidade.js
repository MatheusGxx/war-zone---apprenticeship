'use client'
import Baixar from '../partials/Baixar.js'

const MainUnidade = ({title, subTitle, Component}) =>{

  return(
    <>
      <main className="flex-1 bg-blue-100 p-8 flex items-center flex-col gap-8 sm:gap-4 lg:flex justify-center lg:items-center lg:p-4">

      <section className= "flex gap-2 justify-start sm:text-center">
    
        <div className="flex flex-col w-full sm:flex sm:justiy-center sm:items-center  md:flex md:justiy-center md:items-center lg:flex lg:justify-center lg:items-center"> 


        <h2 className="text-2xl font-bold text-blue-900 sm:text-sm md:whitespace-nowrap lg:text-2xl md:text-center xl:text-center text-center">
          <div className='flex gap-5 justify-center items-center'>
            {title}
          </div>
        </h2>
  
          <div className="flex gap-10 sm:gap-5 flex-wrap sm:justify-center md:justify-center lg:justify-center xl:justify-center w-full xl:flex xl:flex-col xl:items-center justify-center items-center">
            <h2 className="text-xl text-blue-700 font-bold sm:text-sm whitespace-wrap lg:text-xl md:text-center xl:text-center text-center">{subTitle}</h2>
          </div>

        </div>

       </section>
       <div className='bg-white min-h-[350px] w-10/12 sm:w-full md:w-full lg:w-full rounded-lg flex justify-center items-center border border-blue-500'>
        <Component />
       </div>
       </main>
    </>
  )
}

export default MainUnidade

