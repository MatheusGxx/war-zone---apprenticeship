import { createContext, useContext, useState } from 'react'

/////////////////////// ----------- Context Data Horary Doctor ------------ /////////////
const HistoricoContext = createContext()

export const HistoricoProvider = ({ children }) =>{
  const [historico, setHistorico ] = useState([])

  return(
    <HistoricoContext.Provider value={{ historico, setHistorico }}>
      {children}
    </HistoricoContext.Provider>
  )
}

export const useHistorico =  () => {
   const context = useContext(HistoricoContext)

   if(!context){
    throw new Error("useHistorico deve ser usado dentro um HistoricoProvider")
   }

   return context
}

/////////////// ---------- EndRegisterStateOk -----------///////////

const EndRegister = createContext()

export const RegisterEndProvider = ({ children }) => {

  const[registerEndOk, setRegisterEndOk] = useState(false)

  return(
    <EndRegister.Provider value={{registerEndOk, setRegisterEndOk}}>
        {children}
    </EndRegister.Provider>
  )
}

export const useEndRegister = () => {
  const context = useContext(EndRegister)

  if(!context){
    throw new Error('useRegisterEnd deve ser usado dentro de um RegisterEndProvider')
  }

  return context
}

////////////////////// ----- Context Warning Reuniao Acabando ----- //////////////////

const ReuniaoAcabando = createContext()

export const ReuniaoAcabandoProvider = ({ children }) => {
  const [reuniaoAcabando, setReuniaoAcabando] = useState(false)
  
  return(
    <ReuniaoAcabando.Provider value={{reuniaoAcabando, setReuniaoAcabando}}>
          {children}
    </ReuniaoAcabando.Provider>
  )
}

export const UseReuniaoAcabando = () =>{
  const context = useContext(ReuniaoAcabando)

  if(!context){
    throw new Error('useReuniaoAcabando deve ser usado dentro de um ReuniaoAcabandoProvider')
  }

  return context
}

////////////////////// ------Context Atestado ----- //////////////////


const AtestadoMedico = createContext()


export const AtestadoProvider = ({ children }) => {
  const [atestado, setAtestado] = useState(false)

  return(
     <AtestadoMedico.Provider value={{atestado, setAtestado}}>
        {children}
     </AtestadoMedico.Provider>
  )
}


export const useAtestado = () => {
  const context = useContext(AtestadoMedico)

  if(!context){
    throw new Error('useAtestado deve ser usado dentro de um AtestadoProvider')
  }

  return context
}