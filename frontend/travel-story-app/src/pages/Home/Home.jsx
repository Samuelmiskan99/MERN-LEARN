import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import { useEffect, useState } from 'react'

const Home = () => {
   const navigate = useNavigate()
   const [userInfo, setUserInfo] = useState(null)

   //get user
   const getUserInfo = async () => {
      try {
         const response = await axiosInstance.get('/get-user')
         if (response.data && response.data.user) {
            //set user info
            setUserInfo(response.data.user)
         }
      } catch (error) {
         if (error.response.status === 401) {
            localStorage.clear()
            navigate('/login')
         }
      }
   }

   useEffect(() => {
      getUserInfo()
   }, [])
   return (
      <>
         <Navbar userInfo={userInfo} />

         <h1>Home</h1>
      </>
   )
}

export default Home
