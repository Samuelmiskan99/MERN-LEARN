import { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
   const inputRef = useRef(null)
   const [previewUrl, setPreviewUrl] = useState(null)

   const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (file) {
         setImage(file)
      }
   }
   const onChooseFile = () => {
      inputRef.current.click()
   }

   const handleRemoveImage = () => {
      setImage(null)
      handleDeleteImg()
   }

   useEffect(() => {
      //if the image prop is a string (URL) then set the previewUrl
      if (typeof image === 'string') {
         setPreviewUrl(image)
      } else if (image) {
         //if the image prop is an object (file) then set the previewUrl
         setPreviewUrl(URL.createObjectURL(image))
      } else {
         //if the image prop is null then set the previewUrl to null
         setPreviewUrl(null)
      }
      return () => {
         if (previewUrl && typeof previewUrl === 'string') {
            URL.revokeObjectURL(previewUrl)
         }
      }
   }, [image])

   return (
      <div>
         <input
            type='file'
            className='hidden'
            accept='image/*'
            ref={inputRef}
            onChange={handleImageChange}
         />
         {!image ? (
            <button
               className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50'
               onClick={() => onChooseFile()}>
               <div className='w-14 h-14 flex items-center justify-center bg-cyan-50/40 rounded-full border-cyan-100'>
                  <FaRegFileImage className='text-xl text-cyan-500' />
               </div>
               <p className='text-sm text-slate-500'>Browse an image to upload</p>
            </button>
         ) : (
            <div className='w-full relative'>
               <img
                  src={previewUrl}
                  alt='Selected'
                  className='w-full h-[300px] object-cover rounded-lg'
               />
               <button
                  className='btn-small btn-delete absolute top-2 right-2'
                  onClick={handleRemoveImage}>
                  <MdDeleteOutline className='text-lg' />
               </button>
            </div>
         )}
      </div>
   )
}

export default ImageSelector
