const multer = require('multer')
const imageFile = 'uploadImage'//照片上傳儲存資料夾
//設定照片儲存地點及名稱
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/${imageFile}`)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
//設定照片上傳格式
const upload = multer({
  limit: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('請上傳jpg或png檔案'))
    }
  },
  storage
})

module.exports = upload