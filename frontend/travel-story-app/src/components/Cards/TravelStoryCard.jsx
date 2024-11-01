import { FaHeart } from 'react-icons/fa6'
import { GrMapLocation } from 'react-icons/gr'
import moment from 'moment'

const TravelStoryCard = ({
   imageUrl,
   title,
   date,
   story,
   visitedLocation,
   isFavorite,
   onFavoriteClick,
   onClick,
}) => {
   // Log imgUrl to ensure it has the correct value
   console.log('Image URL:', imageUrl)

   return (
      <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 tranisition-all ease-in-out relative cursor-pointer'>
         <img
            src={imageUrl} // Fallback URL if imgUrl is missing or undefined
            alt={title}
            onClick={onClick}
            className='w-full h-56 object-cover rounded-lg'
         />

         <button
            className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4'
            onClick={onFavoriteClick}>
            <FaHeart className={`icon-btn ${isFavorite ? 'text-red-500' : 'text-slate-500'}`} />
         </button>

         <div className='p-4' onClick={onClick}>
            <div className='flex items-center gap-3'>
               <div className='flex-1'>
                  <h6 className='text-sm font-bold'>{title}</h6>
                  <span className='text-xs text-slate-500'>
                     {date ? moment(date).format('DD MMM YYYY') : '-'}
                  </span>
               </div>
            </div>
            <p className='text-xs mt-2 text-slate-600'>{story?.slice(0, 60)}</p>
            <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
               <GrMapLocation className='text-slate-500 text-sm' />
               {visitedLocation.map((item, index) =>
                  visitedLocation.length === index + 1 ? `${item}` : `${item},`
               )}
            </div>
         </div>
      </div>
   )
}

export default TravelStoryCard
