import { useNavigate } from 'react-router-dom'
import LOGO from '../assets/images/story-logo.svg'
import ProfileInfo from './Cards/ProfileInfo'

const Navbar = ({ userInfo }) => {
   const isToken = !!localStorage.getItem('token')
   const navigate = useNavigate()
   const onLogout = () => {
      localStorage.clear()
      window.location.reload()
      navigate('/login')
   }
   return (
      <div className='bg-white flex items-center justify-between px-6  drop-shadow sticky top-0 z-10'>
         <img src={LOGO} alt='travel-story' className='w-[100px]' />

         {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
      </div>
   )
}

export default Navbar
