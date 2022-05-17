export interface IToken {
  id: number
  userId: number
  token: string
  refreshToken: string
  expires: number
  type: string
}