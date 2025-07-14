// Configuration for timeZone, Gmail, and reCAPTCHA

export const timeZoneConfig = {
  timeZone: "Africa/Lusaka"
};

export const gmailConfig = {
  email: process.env.GMAIL_EMAIL || "sammynewlife1@gmail.com",
  clientId: process.env.GMAIL_CLIENT_ID || "858146519569-d3vfs5gqb4pkmov21e543ald5g4csb74.apps.googleusercontent.com",
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  apiKey: process.env.GMAIL_API_KEY
};

export const recaptchaConfig = {
  siteKey: process.env.RECAPTCHA_SITE_KEY || "6Lcy_zQrAAAAAGUz7E8EjCMe2PDfRDxxy2m-ygt_",
  secretKey: process.env.RECAPTCHA_SECRET_KEY
};