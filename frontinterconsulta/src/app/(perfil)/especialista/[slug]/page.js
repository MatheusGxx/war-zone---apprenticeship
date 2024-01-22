import { ComponentLandingPageDoctor } from "@/app/components/ComponenteLandingPageDoctor"

const LandingPageDoctor = ({ params }) => {
  return(
    <>
     <ComponentLandingPageDoctor params={params.slug}/>
    </>
  )
}

export default LandingPageDoctor