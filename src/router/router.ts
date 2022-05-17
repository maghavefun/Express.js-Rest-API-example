import { Router } from 'express'
import FileController from '../controllers/fileController'
import UserController from '../controllers/userController'
import jwtValidate from '../middlewares/jwtValidate'
import fileMiddleware from '../middlewares/file'

const router = Router()

router.post('/signin', UserController.login)
router.post('/signin/new_token', UserController.updateToken)

router.post('/signup', UserController.signUp)

router.get('/file/list', jwtValidate, FileController.getListOfFiles)
router.get('/file/:id', jwtValidate, FileController.getFileInfoById)
router.get('/file/download/:id', jwtValidate, FileController.getFileById)
router.put('/file/update/:id', jwtValidate, fileMiddleware.single('file'), FileController.updateById)
router.post('/file/upload', jwtValidate, fileMiddleware.single('file'), FileController.upload)
router.delete('/file/delete/:id', jwtValidate, FileController.deleteById)

router.get('/info', jwtValidate, UserController.getInfo)
router.get('/logout', jwtValidate, UserController.logout)
router.get('/latency', jwtValidate)

export default router
