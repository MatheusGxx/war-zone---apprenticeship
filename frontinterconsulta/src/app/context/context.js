import { createContext, useContext, useState } from 'react'

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

///////////////////// ----------- Context Blood ------------------ ////////////////

const Blood = createContext()

export const BloodProvider = ({children}) => {
   const[blood, setBlood] = useState(false)
   
   return(
    <Blood.Provider value={{ blood, setBlood}}>
       {children}
    </Blood.Provider>
   )
}

export const useBlood = () => {
  const context = useContext(Blood)

  if(!context){
     throw new Error('useBlood deve ser usado dentro de um BloodProvider')
  }

  return context
}


////////////////// ----------------- Horarios Provider ----------------------- ///////////////

const Horarios = createContext()

export const ProviderHorariosDoctor = ({children}) => {
   const[horariosDoctor, setHorariosDoctor] = useState(false)

   return(
    <Horarios.Provider value={{ horariosDoctor, setHorariosDoctor}}>
       {children}
    </Horarios.Provider>
   )
}

export const useHorariosDoctor = () => {
  const context = useContext(Horarios)

  if(!context){
     throw new Error('useHorariosDoctor deve ser usado dentro de um ProviderHorariosDoctor')
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


///////////////////// ----------- Context Receita Simples ------------------ ////////////////

const ReceitaSimples = createContext()

export const ReceitaSimplesProvider = ({children}) => {
   const[receitaSimples, setReceitaSimples] = useState(null)
   
   return(
    <ReceitaSimples.Provider value={{ receitaSimples, setReceitaSimples}}>
       {children}
    </ReceitaSimples.Provider>
   )
}

export const useReceitaSimples = () => {
  const context = useContext(ReceitaSimples)

  if(!context){
     throw new Error('useReceitaSimples deve ser usado dentro de um ReceitaSimplesProvider')
  }

  return context
}


////////////////// ----------------- Context Receita Controlada ----------------------- ///////////////

const ReceitaControlada = createContext()

export const ReceitaControladaProvider = ({children}) => {
   const[receitaControlada, setReceitaControlada] = useState(null)
   
   return(
    <ReceitaControlada.Provider value={{ receitaControlada, setReceitaControlada }}>
       {children}
    </ReceitaControlada.Provider>
   )
}

export const useReceitaControlada = () => {
  const context = useContext(ReceitaControlada)

  if(!context){
     throw new Error('useReceitaControlada deve ser usado dentro de um ReceitaControladaProvider')
  }

  return context
}


////////////////////////////// -------------------- Context Atestado --------------------------- ///////////////////////

const Atestado = createContext()

export const AtestadoProvider = ({ children }) => {
  const [atestado, setAtestado] = useState(null)

  return(
    <Atestado.Provider value={{ atestado, setAtestado}}>
         {children}
    </Atestado.Provider>
  )
}

export const useAtestado = () => {
  const context = useContext(Atestado)

  if(!context){
    throw new Error('useAtestado deve ser usado dentro de um AtestadoProvider')
  }

  return context
}

//////////////////////////// --------------------------- Exame Provider -------------------------- //////////////////////////

const Exame = createContext()

export const ExameProvider = ({ children }) => {
  const [exame, setExame] = useState(null)
  
  return(
    <Exame.Provider value={{ exame, setExame}}>
         {children}
    </Exame.Provider>
  )
}

export const useExame = () => {
  const context = useContext(Exame)

  if(!context){
    throw new Error('useExame só pode ser usado dentro de um ExameProvider')
  }

  return context
}







