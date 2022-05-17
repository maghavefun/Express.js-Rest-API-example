import sequelize from './sequelizeConnection'
import app from './app'
import CONFIG from './config'

const assertDatabaseConnectionOk = async () => {
	try {
		await sequelize.authenticate()
	} catch (error: any) {
		return console.log('Unable to connect to the database:', error)
	}

    return console.log('Connection to database was successfull!')
}

const start = async () => {
        await assertDatabaseConnectionOk()

        app.listen(
            CONFIG.SERVER.PORT,
            () => console.log(`Server is running on port ${CONFIG.SERVER.PORT}`)
        )

}

start()
