import bcyrpt from 'bcryptjs'
import CONFIG from '../config'

export const hashPassword = (password: string) => {

  return bcyrpt.hashSync(password, CONFIG.SALT)
}