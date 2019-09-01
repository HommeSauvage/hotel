export default {
  appUrl: process.env.APP_URL,
  apiUrl: process.env.API_URL || `${process.env.APP_URL}/api`,
}