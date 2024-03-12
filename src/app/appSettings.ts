export const AppSettings = {
  PORT: 3003,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: '1h',
  MONGO_URI: process.env.MONGO_URI,
  SEND_MAIL_SERVICE_EMAIL: process.env.SEND_MAIL_SERVICE_EMAIL,
  SEND_MAIL_SERVICE_PASSWORD: process.env.SEND_MAIL_SERVICE_PASSWORD,
}
