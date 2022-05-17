import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import { getReadableFileSizeString } from './../helpers/getReadableFileSizeString'
import httpStatusCodes from '../constants/httpStatusCodes'
import ErrorResponse from '../exceptions/errorResponse'
import FileService from '../services/fileService'

class FileController {

  static async upload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if(req.file) {
      const { size, mimetype, filename } = req.file

      const fileData = {
        name: filename,
        extension: mimetype,
        mimetype,
        size: getReadableFileSizeString(size),
      }
      try {
        await FileService.upload(fileData)
      } catch (error) {
        return next(error)
      }

      return res.sendStatus(httpStatusCodes.CREATED)
    }

    return next(new ErrorResponse(httpStatusCodes.BAD_REQUEST))
  }


  static async getListOfFiles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let listOfFiles
    const { limit = 10, page = 0 } = req.params
    const isIncorrectQuery = !Number.isInteger(limit) || limit <= 0 || !Number.isInteger(page) || page < 0

    if(isIncorrectQuery) {
      return next(new ErrorResponse(httpStatusCodes.BAD_REQUEST))
    }

    try {
      listOfFiles = await FileService.getList(Number(limit), Number(page))
    } catch(error) {
      return next(error)
    }

    return res.send(listOfFiles)
  }


  static async deleteById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await FileService.deleteById(Number(req.params.id))
    } catch (error) {
      return next(error)
    }

    res.sendStatus(httpStatusCodes.NO_CONTENT)
  }


  static async getFileInfoById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let fileInfo

    try {
      fileInfo = await FileService.findById(Number(req.params.id))
    } catch (error) {
      return next(error)
    }

    return res.send(fileInfo)
  }

  
  static async getFileById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let file

    try {
      file = await FileService.findById(Number(req.params.id))
    } catch (error) {
      return next(error)
    }

    try {
      if(fs.existsSync(path.resolve(`./files/${file.name}`))) {
        return res.sendFile(path.resolve(`./files/${file.name}`))
      }
    } catch {
      return next(new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR))
    }

  }


  static async updateById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if(req.file) {
      const { size, mimetype, filename } = req.file
      const fileData = {
        name: filename,
        extension: mimetype,
        mimetype,
        size: getReadableFileSizeString(size),
      }

      try {
        await FileService.updateById(Number(req.params.id), fileData)
      } catch (error) {
        return next(error)
      }

      return res.sendStatus(httpStatusCodes.NO_CONTENT)
    }

    return next(new ErrorResponse(httpStatusCodes.BAD_REQUEST))
  }


}

export default FileController