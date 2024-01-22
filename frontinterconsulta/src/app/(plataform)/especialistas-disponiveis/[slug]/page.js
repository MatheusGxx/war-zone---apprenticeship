import PerfilMédico from "../../../components/PerfilMédico.js"

const DynamicRoute = ({params}) =>{
  return(
    <>
    <PerfilMédico params={params.slug}/>
    </>
  )
}

export default DynamicRoute