import moment from 'moment'
import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md'
import PropTypes from 'prop-types'

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
               <div className='flex items-center justify-between gap-3'>
                  <span className='text-xs text-slate-500'>
                     {storyInfo && moment(storyInfo.visitedDate).format('DD-MM-YYYY')}
                  </span>
                  <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1'>
                     <GrMapLocation className='text-sm' />
                     {storyInfo &&
                        storyInfo.visitedLocation.map((item, index) =>
                           storyInfo.visitedLocation.length == index + 1 ? `${item}` : `${item}, `
                        )}
                  </div>
               </div>
            </div>
            <img
               src={storyInfo && storyInfo.imageUrl}
               alt='Selected'
               className='w-full h-[300px] object-cover rounded-lg'
            />
            <div className='mt-4'>
               <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>
                  {storyInfo.story}
               </p>
            </div>
         </div>
      </div>
   )
}
ViewTravelStory.propTypes = {
   storyInfo: PropTypes.shape({
      title: PropTypes.string,
      visitedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Accepting both string and number for date
      visitedLocation: PropTypes.arrayOf(PropTypes.string),
      imageUrl: PropTypes.string,
      story: PropTypes.string,
   }),
   onClose: PropTypes.func.isRequired,
   onEditClick: PropTypes.func.isRequired,
   onDeleteClick: PropTypes.func.isRequired,
}
export default ViewTravelStory
