import { regExp } from './../constants/regExp'

class Validator {
  static isPasswordValid(password: string) {
    return typeof password === 'string' && password.length > 6
  }

  static isLoginValid(login: string) {
    return regExp.email.test(login) || regExp.phone.test(login)
  }

}

export default Validator
