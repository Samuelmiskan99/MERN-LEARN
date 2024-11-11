import { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'react-toastify'

const SignUp = () => {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState(null)

   const navigate = useNavigate()
   const handleSignUp = async (e) => {
      e.preventDefault()
      if (!name) {
         setError('Please enter your name ')
         return
      }
      if (!validateEmail(email)) {
         setError('Invalid email, please enter a valid email address')
         return
      }
      if (!password) {
         setError('Please enter the password')
         return
      }
      setError('')

      //Signup Api Calls
      try {
         const response = await axiosInstance.post('/create-account', {
            fullName: name,
            email: email,
            password: password,
         })
         // Handle successful login response
         if (response.data && response.data.accessToken) {
            toast.success('Account created successfully')
            localStorage.setItem('token', response.data.accessToken)
            navigate('/login')
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
      <div className='h-screen bg-cyan-60 overflow-hidden relative'>
         <div className='login-ui-box right-10 -top-40' />
         <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' />
         <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
            <div className='w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
               <div>
                  <h4 className='text-5xl text-white font-semibold leading-[58px]'>
                     Join the <br />
                     Adventure
                     <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
                        Create an account to get started documenting your adventures to the new
                        places. and preserve your memories in your personal travel journal.
                     </p>
                  </h4>
               </div>
            </div>
            <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
               <form onSubmit={handleSignUp}>
                  <h4 className='text-2xl font-semibold mb-7'>SignUp</h4>
                  <input
                     type='text'
                     placeholder='Full Name'
                     className='input-box'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  />
                  <input
                     type='text'
                     placeholder='Email'
                     className='input-box'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />

                  <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                  {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                  <button type='submit' className='btn-primary'>
                     {' '}
                     Create Account
                  </button>
                  <p className='text-xs text-slate-500 text-center my-4'>Or</p>
                  <button
                     type='submit'
                     className='btn-primary btn-light '
                     onClick={() => {
                        navigate('/login')
                     }}>
                     {' '}
                     Login
                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}

export default SignUp
