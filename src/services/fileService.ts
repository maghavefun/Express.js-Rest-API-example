import fs from 'fs'
import { IFile } from './../interfaces/fileInterface'
import FileModel from '../models/fileModel'
import ErrorResponse from '../exceptions/errorResponse'
import httpStatusCodes from '../constants/httpStatusCodes'

class FileService {


  static async upload(payload: any): Promise<httpStatusCodes> {
    try {
      await FileModel.create(payload)
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    return httpStatusCodes.OK
  }


  static async getList(limit: number = 10, page: number = 0): Promise<IFile[]> {
    let listOfFiles

    try {
      listOfFiles = await FileModel.findAll({
        limit,
        offset: page,
      })
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    return listOfFiles
  }


  static async deleteById(id: number): Promise<void> {
    let file

    try {
      file = await FileService.findById(id)
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    try {
      fs.unlinkSync(`./files/${file.name}`)
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    try {
      await FileModel.destroy({ where: {id} })
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  }


  static async findById(id: number): Promise<IFile> {
    let foundFile

    try {
      foundFile = await FileModel.findByPk(id)
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    if(foundFile) {
      return foundFile
    }

    throw new ErrorResponse(httpStatusCodes.NOT_FOUND)
  }


  static async updateById(id: number, payload: any): Promise<httpStatusCodes> {
    let file
    let { name, extension, mimetype, size } = payload

    try {
      file = await FileModel.findByPk(id)
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    if(file) {
      try {
        fs.unlinkSync(`./files/${file.name}`)
      } catch(e) {
        throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
      }
      try {
        file.name = name
        file.extension = extension
        file.mimetype = mimetype
        file.size = size
        file.uploadDate = new Date()
        await file.save()
      } catch {
        throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
      }

      return httpStatusCodes.OK
    }

    throw new ErrorResponse(httpStatusCodes.NOT_FOUND)
  }
}

export default FileService