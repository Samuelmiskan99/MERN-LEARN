import moment from 'moment'
import PropTypes from 'prop-types'
import { MdOutlineClose } from 'react-icons/md'

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {
   const DateRangeChip = ({ date }) => {
      const startDate = date?.from ? moment(date?.from).format('DD-MM-YYYY') : 'N/A'
      const endDate = date?.to ? moment(date?.to).format('DD-MM-YYYY') : 'N/A'
      return (
         <div className='flex items-center gap-2 bg-slate-100 px-3 py-2 rounded'>
            <p className='text-xs font-medium'>
               {startDate} - {endDate}
            </p>
            <button onClick={onClear}>
               <MdOutlineClose />
            </button>
         </div>
      )
   }
   return (
      filterType && (
         <div className='mb-5'>
            {filterType === 'search' ? (
               <h3 className='text-lg font-medium'>Search Result</h3>
            ) : (
               <div className='flex items-center gap-2'>
                  <h3 className='text-lg font-medium'>Travel Stories From</h3>
                  <DateRangeChip date={filterDates} />
               </div>
            )}
         </div>
      )
   )
}
FilterInfoTitle.propTypes = {
   date: PropTypes.shape({
      from: PropTypes.instanceOf(Date),
      to: PropTypes.instanceOf(Date),
   }),
   onClear: PropTypes.func.isRequired,
   filterType: PropTypes.string.isRequired,
}

export default FilterInfoTitle
