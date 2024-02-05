import { app } from './app'
import { AppSettings } from './appSettings'

app.listen(AppSettings.PORT, () => {
  console.log(`App watching at port: ${AppSettings.PORT}`)
})
