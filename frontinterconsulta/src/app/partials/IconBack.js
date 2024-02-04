'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const IconBack = () => {
  const Router = useRouter()

  const HandleBackRouter = () => {
    Router.back()
  }

  return (
    <>
        <ArrowBackIcon 
          className="cursor-pointer "
          sx={{ color: 'blue' }}
          onClick={() => HandleBackRouter()}
        />
    </>
  )
}

export default IconBack
