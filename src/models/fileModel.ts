import { IFile } from './../interfaces/fileInterface'
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../sequelizeConnection'

type IFileCreation = Optional<IFile, 'id' | 'uploadDate'>

class FileModel extends Model<IFile, IFileCreation> {
  declare id: number
  declare name: string
  declare extension: string
  declare mimetype: string
  declare size: string
  declare uploadDate: Date
}

FileModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extension: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadDate: {
    type: DataTypes.DATE,
    defaultValue: Date.now
  }
},
{
  tableName: 'files',
  sequelize
})

export default FileModel