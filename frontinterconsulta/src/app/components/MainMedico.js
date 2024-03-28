
const MainMedico = ({title, subTitle, Component}) => {
   
  return (
    <>
    <main className="flex-1 bg-blue-100 p-8 flex items-center flex-col gap-8 lg:flex justify-center lg:items-center lg:p-4">

      <section className= "flex flex-col gap-2 justify-start md:pr-0 lg:pr-0 xl:pr-0">

        <h2 className="text-3xl font-bold text-blue-900 sm:text-base md:whitespace-nowrap lg:text-2xl md:text-center xl:text-center">{title}</h2>

    
        <div
         className="flex gap-5 sm:flex sm:flex-col
         md:flex md:flex-col md:justify-center md:items-center
         lg:flex lg:flex-col lg:justify-center lg:items-center
         xl:flex xl:flex-col xl:justify-center xl:items-center
        ">
          <h2 className="text-2xl text-blue-700 font-bold sm:text-base whitespace-wrap lg:text-xl md:text-center xl:text-center">{subTitle}</h2>
        </div>
          <div className="border-b-2 border-red-500  w-1/3 pt-3 sm:hidden md:hidden lg:hidden xl:hidden">
          </div>

      </section>

      <div className='bg-white min-h-[300px] w-3/4 sm:w-full md:w-full lg:w-full rounded-lg flex flex-col gap-4 border border-blue-500'>
        <Component />
      </div>
      
     </main>
    </>
  );
}

export default MainMedico
