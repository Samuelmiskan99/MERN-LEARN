import { FaHeart } from 'react-icons/fa6'
import { GrMapLocation } from 'react-icons/gr'
import PropTypes from 'prop-types'

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
      <div className=''>
         <img
            src={imageUrl} // Fallback URL if imgUrl is missing or undefined
            alt={title}
            onClick={onClick}
            className='w-full h-56 object-cover rounded-lg'
         />
         <h2>{title}</h2>
      </div>
   )
}

export default TravelStoryCard
