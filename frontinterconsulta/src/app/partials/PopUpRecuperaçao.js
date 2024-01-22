'use client'
import { useState, useEffect} from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField} from "@mui/material"
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Logo2 from '../public/Logo2.png'
import Logo from '../public/logo.png'
import Image from 'next/image'

const PopUpRecuperaçao = () =>{

  useEffect(() =>{
    HandleOpen()
  },[])

  const[open, setOpen] = useState(false)

  const[name, setName ] = useState('')
  const[email, setEmail ] = useState('')
  const[telefone, setTelefone ] = useState('')

  const HandleOpen = () =>{
    setOpen(!open) //True
  }

  const HandleClose = () =>{
    setOpen(false)
  }
  const Params = useSearchParams()

  const Value = Params.get('persona')

  const PersonaMédico = Value === 'medico'
  const PersonaPaciente = Value === 'paciente'
  const PersonaUnidade = Value === 'unidade'

  const handleClickEnd = () =>{
     //Request of data in APIRestFull
  }
  return(
    <>

    <Dialog open={open} onClose={HandleClose} className="p-10">
           <div className="flex flex-col justify-center ">
             <DialogTitle>
                <Image
                src={Logo2}
                alt="Logo 2 Interconsulta"
                height={200}
                width={220}
                />
              </DialogTitle>
             { PersonaMédico &&  <DialogTitle className="text-center"> Não Saia Dr(a)
             <SentimentVeryDissatisfiedIcon/> </DialogTitle> }

             { PersonaPaciente &&  <DialogTitle className="text-center"> Não Saia Paciente
             <SentimentVeryDissatisfiedIcon/> </DialogTitle> }

             { PersonaUnidade &&  <DialogTitle className="text-center"> Não Saia Unidade
             <SentimentVeryDissatisfiedIcon/> </DialogTitle> }

             {(PersonaMédico || PersonaPaciente || PersonaUnidade) === false && <DialogTitle className="text-center"> Fique por dentro! </DialogTitle>}

             
            </div>
            <DialogContent>
            <div className="flex flex-col gap-5">
              <TextField
                     variant="standard"
                     label="Seu Nome"
                     InputProps={{
                      sx: { borderBottom: "1px solid blue" }
                    }}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    required/>
                  <TextField
                     variant="standard"
                     label="Seu Melhor email"
                     InputProps={{
                      sx: { borderBottom: "1px solid blue" }
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    required/>
                  <TextField
                     variant="standard"
                     label="Telefone para contato"
                     InputProps={{
                      sx: { borderBottom: "1px solid blue" }
                    }}
                    onChange={(e) => setTelefone(e.target.value)}
                    value={telefone}
                    type="number"
                    required/>
                   </div>
            </DialogContent>
            <DialogActions>
            <button onClick={() => handleClickEnd()} className="w-64 h-10 rounded-full bg-indigo-950 text-white font-light">
             Enviar
           </button>
            </DialogActions>

            <div className="flex justify-end p-4">
            <Image
            src={Logo}
            alt="Logo Interconsulta"
            height={40}
            width={40}
            />
           </div>

    </Dialog>
    
    </>
  )
}

export default PopUpRecuperaçao