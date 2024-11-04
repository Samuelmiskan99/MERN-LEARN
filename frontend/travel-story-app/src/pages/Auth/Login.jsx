import { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import VIDEO_BACKGROUND from '../../assets/video/bg-video.mp4'

const Login = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState(null)
   const navigate = useNavigate()

   const handleLogin = async (e) => {
      e.preventDefault()
      if (!validateEmail(email)) {
         setError('Invalid email, please enter a valid email address')
         return
      }
      if (!password) {
         setError('Please enter the password')
         return
      }
      setError('')

      try {
         const response = await axiosInstance.post('/login', {
            email: email,
            password: password,
         })
         if (response.data && response.data.user && response.data.user.accessToken) {
            localStorage.setItem('token', response.data.user.accessToken)
            navigate('/dashboard')
         }
      } catch (error) {
         console.error('Login error:', error)
         if (error.response && error.response.status === 400 && error.response.data) {
            setError(error.response.data.message)
         } else {
            setError('Something went wrong. Please try again later.')
         }
      }
   }

   return (
      <div className='flex h-screen w-screen overflow-hidden'>
         {/* Left Side - Video Background */}
         <div className='relative w-1/2 h-full'>
            <video autoPlay loop muted className='absolute top-0 left-0 w-full h-full object-cover'>
               <source src={VIDEO_BACKGROUND} type='video/mp4' />
               Your browser does not support the video tag.
            </video>
            {/* Overlay with Text */}
            <div className='absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-10'>
               <h2 className='text-4xl font-bold text-white mb-4'>CAPTURE YOUR JOURNEY</h2>
               <p className='text-white text-sm'>
                  Record your travels and share them with the world
               </p>
            </div>
         </div>

         {/* Right Side - Login Form with Floating Shapes */}
         <div className='flex w-1/2 h-full items-center justify-center bg-white px-8 relative overflow-hidden'>
            {/* Floating Shapes */}
            <div className='shape shape-blue'></div>
            <div className='shape shape-cyan'></div>
            <div className='shape shape-light'></div>

            <div className='w-full max-w-md z-10'>
               <form onSubmit={handleLogin} className='space-y-6'>
                  <h3 className='text-2xl font-semibold text-gray-800'>Login</h3>

                  <div>
                     <label className='block text-gray-600'>Email</label>
                     <input
                        type='text'
                        placeholder='Email'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>

                  <div>
                     <label className='block text-gray-600'>Password</label>
                     <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>

                  {error && <p className='text-red-500 text-sm'>{error}</p>}

                  <button
                     type='submit'
                     className='w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-cyan-600 transition'>
                     Login
                  </button>

                  <p className='text-center text-gray-500 text-sm my-4'>Or</p>

                  <button
                     type='button'
                     onClick={() => navigate('/signUp')}
                     className='w-full py-2 bg-indigo-300 text-cyan-50 rounded-lg hover:bg-cyan-200 transition'>
                     Create Account
                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}

export default Login
