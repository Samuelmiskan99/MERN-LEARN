import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axiosInstance from '../../utils/axiosInstance'
import Modal from 'react-modal'

import { useEffect, useState } from 'react'
import TravelStoryCard from '../../components/Cards/TravelStoryCard'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddEditTravelStory from './AddEditTravelStory'
import ViewTravelStory from './ViewTravelStory'
import { BiMessageSquareAdd } from 'react-icons/bi'

import EmptyCards from '../../components/Cards/EmptyCards'
import { DayPicker } from 'react-day-picker'
import moment from 'moment'
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle'
import { getEmptyCardImage, getEmptyCardMessage } from '../../utils/helper'

const Home = () => {
   const navigate = useNavigate()
   const [userInfo, setUserInfo] = useState({})
   const [allStories, setAllStories] = useState([])
   const [openAddEditModal, setOpenAddEditModal] = useState({
      isShow: false,
      type: 'add',
      data: null,
   })
   const [openViewModal, setOpenViewModal] = useState({
      isShow: false,
      data: null,
   })

   //range picker
   const [dateRange, setDateRange] = useState({ form: null, to: null })

   //searchbar
   const [searchQuery, setSearchQuery] = useState('')
   const [filterType, setFilterType] = useState('')

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

   //edit travel
   const handleEdit = (data) => {
      setOpenAddEditModal({ isShow: true, type: 'edit', data: data })
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

   const handleViewStory = (data) => {
      setOpenViewModal({ isShow: true, data })
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

            if (filterType === 'search' && searchQuery) {
               onSearchStory(searchQuery)
            } else if (filterType === 'date') {
               filterStoriesByDate(dateRange)
            } else {
               getAllTravelStories()
            }
         }
      } catch (error) {
         console.error('An unexpected error occurred. please try again', error)
      }
   }

   //Handle Delete Story
   const deleteTravelStory = async (data) => {
      const storyId = data._id
      try {
         const response = await axiosInstance.delete(`/delete-story/${storyId}`)
         if (response.data && !response.data.error) {
            toast.error('Travel story deleted successfully')
            setOpenViewModal((prev) => ({ ...prev, isShow: false }))
            getAllTravelStories()
         }
      } catch (error) {
         console.error('An unexpected error occurred. please try again', error)
      }
   }

   //handle Search Story
   const onSearchStory = async (query) => {
      try {
         const response = await axiosInstance.get(`/search-story`, { params: { query } })
         if (response.data && response.data.stories) {
            setAllStories(response.data.stories)
            setFilterType('search')
         }
      } catch (error) {
         console.error('An unexpected error occurred. please try again', error)
      }
   }

   //handle Clear Search
   const handleClearSearch = () => {
      setFilterType('')
      getAllTravelStories()
   }

   //filter stories by date
   const filterStoriesByDate = async (day) => {
      try {
         const startDate = day.from ? moment(day.from).valueOf() : null
         const endDate = day.to ? moment(day.to).valueOf() : null

         if (startDate && endDate) {
            const response = await axiosInstance.get('/filter-story', {
               params: { startDate, endDate },
            })
            if (response.data && response.data.stories) {
               setFilterType('date')
               setAllStories(response.data.stories)
            }
         }
      } catch (error) {
         console.error('An unexpected error occurred. please try again', error)
      }
   }
   //date range picker
   const handleDayClick = (day) => {
      setDateRange(day)
      filterStoriesByDate(day)
   }

   //reset filter
   const resetFilter = () => {
      setDateRange({ from: null, to: null })
      setFilterType('')
      getAllTravelStories()
   }
   useEffect(() => {
      getAllTravelStories()
      getUserInfo()
   }, [])

   return (
      <>
         <Navbar
            userInfo={userInfo}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchNote={onSearchStory}
            handleClearSearch={handleClearSearch}
         />
         <div className='container mx-auto py-10'>
            <FilterInfoTitle
               filterType={filterType}
               filterDates={dateRange}
               onClear={() => {
                  resetFilter()
               }}
            />
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
                              onClick={() => handleViewStory(item)}
                              onFavoriteClick={() => handleUpdateFavorite(item)}
                           />
                        ))}
                     </div>
                  ) : (
                     <EmptyCards
                        imageSrc={getEmptyCardImage(filterType)}
                        message={getEmptyCardMessage(filterType)}
                     />
                     // <p className='text-center text-gray-500'>No travel stories available.</p>
                  )}
               </div>
               <div className='w-[400px]'>
                  <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg mr-5'>
                     <div className='p-3'>
                        <DayPicker
                           captionLayout='dropdown-buttons'
                           mode='range'
                           selected={dateRange}
                           onSelect={handleDayClick}
                           pagedNavigation
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Add and edit travel story modal */}
         <Modal
            isOpen={openAddEditModal.isShow}
            onRequestClose={() => {
               setOpenAddEditModal({ isShow: false, type: 'add', data: null })
            }}
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
         {/* Add and edit travel story modal */}
         <Modal
            isOpen={openViewModal.isShow}
            onRequestClose={() => {}}
            style={{ overlay: { backgroundColor: 'rgba(0, 0, 0,0.2)', zIndex: 999 } }}
            appElement={document.getElementById('root')}
            className='model-box'>
            {' '}
            <ViewTravelStory
               storyInfo={openViewModal.data || null}
               onClose={() => {
                  setOpenViewModal((prevState) => ({ ...prevState, isShow: false }))
               }}
               onEditClick={() => {
                  setOpenViewModal((prevState) => ({ ...prevState, isShow: false }))
                  handleEdit(openViewModal.data || null)
               }}
               onDeleteClick={() => {
                  deleteTravelStory(openViewModal.data || null)
               }}
            />
         </Modal>
         <button
            className='w-16 h-16 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-blue-500 fixed right-10 bottom-10'
            onClick={() => setOpenAddEditModal({ isShow: true, type: 'add', data: null })}>
            <BiMessageSquareAdd className='text-[32px] text-white ' />
         </button>

         <ToastContainer />
      </>
   )
}

export default Home
