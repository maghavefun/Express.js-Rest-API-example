import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './files/')
  },
  filename: (req, file, callBack) => {
      callBack(null, Date.now() + file.originalname)
  }
})

export default multer({storage})