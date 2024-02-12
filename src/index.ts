import { app } from './app/app'
import { AppSettings } from './app/appSettings'
import { runDb } from './app/config/db'

const startApp = async () => {
  await runDb()

  app.listen(AppSettings.PORT, () => {
    console.log(`App watching at port: ${AppSettings.PORT}`)
  })
}

startApp()
