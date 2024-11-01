import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'

import { useEffect, useState } from 'react'
import TravelStoryCard from '../../components/Cards/TravelStoryCard'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddEditTravelStory from './AddEditTravelStory'

const Home = () => {
   const navigate = useNavigate()
   const [userInfo, setUserInfo] = useState({})
   const [allStories, setAllStories] = useState([])
   const [openAddEditModal, setOpenAddEditModal] = useState({
      isShow: false,
      type: 'add',
      data: null,
   })

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
   const handleUpdateFavorite = async (storyData) => {
      const storyId = storyData._id
      console.log('Update favorite:', storyData)

      try {
         const response = await axiosInstance.put(`/update-favorite/${storyId}`, {
            isFavorite: !storyData.isFavorite,
         })
         if (response.data && response.data.story) {
            toast.success('Travel story updated successfully')
            getAllTravelStories()
         }
      } catch (error) {
         console.error('An unexpected error occurred. please try again', error)
      }
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

         {/* Add and edit travel story modal */}
         <Modal
            isOpen={openAddEditModal.isShow}
            onRequestClose={() => {}}
            style={{ overlay: { backgroundColor: 'rgba(0, 0, 0,0.2)', zIndex: 999 } }}
            appElement={document.getElementById('root')}
            className='model-box'>
            <AddEditTravelStory
               type={openAddEditModal.type}
               storyInfo={openAddEditModal.data}
               onClose={() => setOpenAddEditModal({ isShow: false, type: 'add', data: null })}
               getAllTravelStories={getAllTravelStories}
            />
         </Modal>
         <button
            className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10'
            onClick={() => setOpenAddEditModal({ isShow: true, type: 'add', data: null })}>
            <MdAdd className='text-[32px] text-white ' />
         </button>

         <ToastContainer />
      </>
   )
}

export default Home
