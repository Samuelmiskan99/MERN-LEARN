import React from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md'

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
   return (
      <div className='relative'>
         <div className='flex items-center justify-end'>
            <div className='flex items-center gap-3'>
               <button
                  className='btn-small flex items-center gap-1 bg-cyan-50/50 p-2 rounded-lg'
                  onClick={onEditClick}>
                  <MdUpdate className='text-lg text-cyan-500' /> UPDATE STORY
               </button>

               <button
                  className='btn-small flex items-center gap-1 bg-red-50 p-2 rounded-lg'
                  onClick={onDeleteClick}>
                  <MdDeleteOutline className='text-lg text-red-500' /> Delete
               </button>
            </div>
            <button className='text-slate-400 text-xl ml-3' onClick={onClose}>
               <MdClose />
            </button>
         </div>
         <div>
            <div className='flex-1 flex flex-col gap-2 py-4'>
               <h1 className='text-2xl text-slate-950'>{storyInfo && storyInfo.title}</h1>
            </div>
         </div>
      </div>
   )
}

export default ViewTravelStory
