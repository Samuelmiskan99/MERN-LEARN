import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
   return (
      <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
         <input
            type='text'
            placeholder='Search Your Stories'
            className='w-full bg-transparent outline-none text-xs py-[11px] pl-3'
            value={value}
            onChange={onChange}
         />
         {value && (
            <IoMdClose
               className='text-slate-400 cursor-pointer hover:text-black text-xl mr-3'
               onClick={onClearSearch}
            />
         )}
         <FaMagnifyingGlass
            className='text-slate-400 cursor-pointer hover:text-black'
            onClick={handleSearch}
         />
      </div>
   )
}

export default SearchBar
