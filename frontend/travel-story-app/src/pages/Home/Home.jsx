import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import { useEffect, useState } from 'react'
import TravelStoryCard from '../../components/Cards/TravelStoryCard'

const Home = () => {
   const navigate = useNavigate()
   const [userInfo, setUserInfo] = useState({})
   const [allStories, setAllStories] = useState([])

   // Get user info
   const getUserInfo = async () => {
      try {
         const response = await axiosInstance.get('/get-user')
         if (response.data && response.data.user) {
            setUserInfo(response.data.user)
         }
      } catch (error) {
         if (error.response && error.response.status === 401) {
            localStorage.clear()
            navigate('/login')
         } else {
            console.error('An unexpected error occurred', error)
         }
      }
   }

   // Get all travel stories
   const getAllTravelStories = async () => {
      try {
         const response = await axiosInstance.get('/get-all-stories')
         if (response.data && response.data.stories) {
            console.log('Fetched stories:', response.data.stories) // Log to verify
            setAllStories(response.data.stories)
         }
      } catch (error) {
         console.error('An unexpected error has occurred, please try again', error)
      }
   }

   // Handle edit story click
   const handleEdit = (data) => {
      console.log('Edit story:', data)
   }

   // Handle travel story click
   const handleViewStory = (data) => {
      console.log('View story:', data)
   }

   // Handle update favorite
   const handleUpdateFavorite = (storyData) => {
      console.log('Update favorite:', storyData)
   }

   useEffect(() => {
      getAllTravelStories()
      getUserInfo()
   }, [])

   return (
      <>
         <Navbar userInfo={userInfo} />
         <div className='container mx-auto py-10'>
            <div className='flex gap-7'>
               <div className='flex-1'>
                  {allStories.length > 0 ? (
                     <div className='grid grid-cols-2 gap-4'>
                        {allStories.map((item) => (
                           <TravelStoryCard
                              key={item._id}
                              imageUrl={item.imageUrl}
                              title={item.title}
                              story={item.story}
                              visitedLocation={item.visitedLocation}
                              date={item.visitedDate}
                              isFavorite={item.isFavorite}
                              onEdit={() => handleEdit(item)}
                              onClick={() => handleViewStory(item)}
                              onFavoriteClick={() => handleUpdateFavorite(item)}
                           />
                        ))}
                     </div>
                  ) : (
                     <p className='text-center text-gray-500'>No travel stories available.</p>
                  )}
               </div>
               <div className='w-[320px]'></div>
            </div>
         </div>
      </>
   )
}

export default Home
