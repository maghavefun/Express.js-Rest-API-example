import 'dotenv/config'
import { Sequelize } from 'sequelize'

const {
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  DB_PORT
} = process.env

const sequelize = new Sequelize(`${DB_NAME}`, `${DB_USER}`, `${DB_PASS}`, {
  host: `${DB_HOST}`,
  dialect: 'mysql',
  storage: './testrestapiDB',
  logQueryParameters: true,
	benchmark: true,
  port: Number(DB_PORT)
})

sequelize.sync()

export default sequelize