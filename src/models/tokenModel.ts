import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../sequelizeConnection'
import { IToken } from './../interfaces/tokenInterface'

type ITokenCreation = Optional<IToken, 'id' | 'expires' | 'type'>

class TokenModel extends Model<IToken, ITokenCreation> {
  declare id: number
  declare userId: number
  declare token: string
  declare refreshToken: string
  declare expires: number
  declare type: string
}

TokenModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expires: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1800000
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Bearer'
  }
},
{
  tableName: 'tokens',
  sequelize
})

export default TokenModel