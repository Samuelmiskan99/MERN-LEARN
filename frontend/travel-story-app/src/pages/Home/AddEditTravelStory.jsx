import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from 'react-icons/md'
import DateSelector from '../../components/input/DateSelector'
import { useState } from 'react'
import ImageSelector from '../../components/input/ImageSelector'
import TagInput from '../../components/input/TagInput'
import moment from 'moment'
import axiosInstance from '../../utils/axiosInstance'
import uploadImage from '../../utils/uploadImage'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
   const [title, setTitle] = useState(storyInfo?.title || '')
   const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
   const [story, setStory] = useState(storyInfo?.story || '')
   const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || [])
   const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
   const [error, setError] = useState('')

   //add new Travel Story
   const addNewTravelStory = async () => {
      try {
         let imageUrl = ''
         //upload image if present
         if (storyImg) {
            const imageUpLoadRes = await uploadImage(storyImg)
            //get image url
            imageUrl = imageUpLoadRes.imageUrl || ''
         }
         const response = await axiosInstance.post('/add-travel-story', {
            title,
            story,
            visitedLocation,
            imageUrl: imageUrl || '',
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
         })
         if (response.data && response.data.story) {
            toast.success('Story Added  Successfully')
            //refresh Stories
            getAllTravelStories()
            //close modal or form
            onClose()
         }
      } catch (error) {
         if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message)
         } else {
            setError('Something went wrong, please try again later')
         }
      }
   }
   //update Travel Story
   const updateTravelStory = async () => {
      const storyId = storyInfo._id
      try {
         let imageUrl = storyInfo.imageUrl || ''
         let postData = {
            title,
            story,
            visitedLocation,
            imageUrl,
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
         }

         // If a new image file is selected, upload it and update the imageUrl
         if (typeof storyImg === 'object') {
            const imgUploadRes = await uploadImage(storyImg)
            imageUrl = imgUploadRes.imageUrl || ''
            postData = {
               ...postData,
               imageUrl: imageUrl || '',
            }
         }

         const response = await axiosInstance.put('/edit-story/' + storyId, postData)
         if (response.data && response.data.story) {
            toast.success('Story Updated Successfully')
            getAllTravelStories()
            onClose()
         }
      } catch (error) {
         if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message)
         } else {
            setError('Something went wrong, please try again later')
         }
      }
   }

   const handleAddorUpdateClick = () => {
      console.log('input Data', { title, storyImg, story, visitedLocation, visitedDate })
      if (!title) {
         setError('Please enter the title')
         return
      }
      if (!story) {
         setError('Please enter the story')
         return
      }
      setError('')
      if (type === 'edit') {
         updateTravelStory()
      } else {
         addNewTravelStory()
      }
   }

   //handle delete story and update story
   const handleDeleteStoryImg = async () => {}

   return (
      <div className='relative'>
         <div className='flex items-center justify-between '>
            <h5 className='text-xl font-medium text-slate-700'>
               {type === 'add' ? 'Add Travel Story' : 'Update Travel Story'}
            </h5>
            <div>
               <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                  {type === 'add' ? (
                     <button className='btn-small' onClick={handleAddorUpdateClick}>
                        <MdAdd className='text-lg' /> Add Story
                     </button>
                  ) : (
                     <>
                        <button className='btn-small' onClick={handleAddorUpdateClick}>
                           <MdUpdate className='text-lg' /> Update Story
                        </button>
                     </>
                  )}
                  <button className='' onClick={onClose}>
                     <MdClose className='text-xl text-slate-400' />
                  </button>
               </div>
               {error && <p className='text-xs pt-2 text-right text-red-500'>{error}</p>}
            </div>
         </div>
         <div>
            <div className='flex-1 flex flex-col gap-2 pt-4'>
               <label className='input-label'>Title</label>
               <input
                  type='text'
                  className='text-2xl text-slate-950 outline-none'
                  placeholder='A day at great wall'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               <div className='my-3'>
                  <DateSelector date={visitedDate} setDate={setVisitedDate} />
               </div>

               {/* Image selector */}
               <ImageSelector
                  image={storyImg}
                  setImage={setStoryImg}
                  handleDeleteImg={handleDeleteStoryImg}
               />

               <div className='flex flex-col gap-2 mt-4'>
                  <label className='input-label'>Story</label>
                  <textarea
                     type='text'
                     className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                     placeholder='Your Story'
                     rows={10}
                     value={story}
                     onChange={(e) => setStory(e.target.value)}
                  />
               </div>
               <div className='pt-3'>
                  <label className='input-label'>Visited Location</label>
                  <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
               </div>
            </div>
         </div>
      </div>
   )
}

AddEditTravelStory.propTypes = {
   storyInfo: PropTypes.shape({
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      story: PropTypes.string,
      visitedLocation: PropTypes.arrayOf(PropTypes.string),
      visitedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.string,
   }),
   type: PropTypes.oneOf(['add', 'edit']).isRequired,
   onClose: PropTypes.func.isRequired,
   getAllTravelStories: PropTypes.func.isRequired,
};

export default AddEditTravelStory
