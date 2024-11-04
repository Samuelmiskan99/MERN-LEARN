import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useState } from 'react'

const PasswordInput = ({ value, onChange, placeholder }) => {
   const [showPassword, setShowPassword] = useState(false)

   const toggleShowPassword = () => {
      setShowPassword(!showPassword)
   }

   return (
      <div className='relative mb-4'>
         <input
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Password'}
            className='w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
         />
         <span
            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer'
            onClick={toggleShowPassword}>
            {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
         </span>
      </div>
   )
}

export default PasswordInput
