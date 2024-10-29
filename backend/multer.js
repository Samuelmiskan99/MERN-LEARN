const multer = require('multer')
const path = require('path')

//storage configuration
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './uploads/') //destination folder for storing uploaded file
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //unique filename
   },
})

//file filter to accept images only
const fileFilter = (req, file, cb) => {
   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true)
   } else {
      cb(new Error(' Only .png, .jpg and .jpeg format allowed!'), false)
   }
}
//initialize multer instance
const upload = multer({ storage: storage, fileFilter: fileFilter })

module.exports = upload
