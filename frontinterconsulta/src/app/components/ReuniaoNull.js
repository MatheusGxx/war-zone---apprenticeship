import Image from "next/image"
import IconNull from '../public/IconNull.png'

const ReuniaoNull = () =>{
  return(
    <>
     <div className="w-6/12 flex flex-col justify-center gap-9 items-center">
     <Image src={IconNull} alt="Logo Reuniao" height={20} width={150} />
     <h1 className="font-bold text-2xl sm:text-sm text-center sm:text-center"> Ops, infelizmente voce nao é Médico nem paciente =/ </h1>
     </div>
    </>
  )
}

export default ReuniaoNull