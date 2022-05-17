import 'dotenv/config'
import crypto from 'crypto'

const GENERATED_ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString('hex')
const GENERATED_REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString('hex')

const {
    SRV_PORT,
    NODE_ENV,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    SALT
} = process.env

const CONFIG = {
    SERVER: {
        PORT: SRV_PORT
    },
    ENV: NODE_ENV,
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET || GENERATED_ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET || GENERATED_REFRESH_TOKEN_SECRET,
    MAX_COUNTS_OF_LOGIN: 5,
    MINUTES_TO_UNBAN: 30,
    SALT
}

export default CONFIG
