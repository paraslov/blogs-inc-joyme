import { app } from './app/app'
import { AppSettings } from './app/appSettings'

app.listen(AppSettings.PORT, () => {
  console.log(`App watching at port: ${AppSettings.PORT}`)
})
