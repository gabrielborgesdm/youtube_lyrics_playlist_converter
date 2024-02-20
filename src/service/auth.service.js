import { OAuth2Client } from 'google-auth-library'

export default class AuthService {
  constructor () {
    this.oauth2Client = new OAuth2Client(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET)
  }

  async getAuthenticationUrl () {
    const authorizeUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube'],
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
    })

    return authorizeUrl
  }

  async authenticateAndGetClient (code) {
    return await new Promise((resolve, reject) => {
      this.oauth2Client.getToken({ code, redirect_uri: 'urn:ietf:wg:oauth:2.0:oob' }, (err, token) => {
        if (err) {
          reject(err)
        }
        this.oauth2Client.setCredentials(token)

        resolve(this.oauth2Client)
      })
    })
  }
}
