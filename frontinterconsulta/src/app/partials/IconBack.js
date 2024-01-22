'use client'
import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import { useRouter } from 'next/navigation';

const IconBack = () => {
  const Router = useRouter()

  const HandleBackRouter = () => {
    Router.back()
  }

  return (
    <>
        <KeyboardBackspaceSharpIcon
          className="cursor-pointer "
          sx={{ color: 'blue' }}
          onClick={() => HandleBackRouter()}
        />
    </>
  )
}

export default IconBack
