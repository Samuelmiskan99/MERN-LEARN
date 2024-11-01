import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from 'react-icons/md'
import DateSelector from '../../components/input/DateSelector'
import { useState } from 'react'
import ImageSelector from '../../components/input/ImageSelector'

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
   const [title, setTitle] = useState('')
   const [storyImg, setStoryImg] = useState(null)
   const [story, setStory] = useState('')
   const [visitedLocation, setVisitedLocation] = useState([])

   const [visitedDate, setVisitedDate] = useState(null)

   const handleAddorUpdateClick = () => {}
   return (
      <div>
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
               <ImageSelector image={storyImg} setImage={setStoryImg} />

               <div className='flex flex-col gap-2 mt-4'>
                  <label className='input-label'>Story</label>
                  <textarea
                     type='text'
                     className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                     placeholder='Your Story'
                     rows={10}
                     value={story}
                     onChange={(e) => setStory(e.target.value)}></textarea>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AddEditTravelStory
