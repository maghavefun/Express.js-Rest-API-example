import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../sequelizeConnection'
import { hashPassword } from '../helpers/hashPassword'
import { IUser } from './../interfaces/userInterface'

type IUserCreation = Optional<IUser, 'id'>

class UserModel extends Model<IUser,IUserCreation> {
  declare id: number
  declare firstName: string
  declare lastName: string
  declare login: string
  declare password: string
}

UserModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.setDataValue('password', hashPassword(value))
    }
  },
},
{
  tableName: 'users',
  sequelize
})

export default UserModel