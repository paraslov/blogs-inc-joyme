import express from 'express'

export const app = express()

app.get('/', (req, res) => {
  res.send('Welcome to JoymeStudios App!')
})
