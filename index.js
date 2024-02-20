import YoutubeService from './src/service/youtube.service.js'
import SongService from './src/service/song.service.js'
import AuthService from './src/service/auth.service.js'
import readline from 'readline'

async function main () {
  const authService = new AuthService()
  const authorizationUrl = await authService.getAuthenticationUrl()

  console.log('Authorize this app by visiting this url:', authorizationUrl)

  const code = await askCode()

  const authClient = await authService.authenticateAndGetClient(code)

  const youtubeService = new YoutubeService(authClient)
  const songsService = new SongService()

  let songs = await youtubeService.getPlaylistItemsTitles()
  songs = songsService.sanitizeSongTitles(songs)
  const playlistId = await youtubeService.createPlaylist()

  for (const song of songs) {
    const songId = await youtubeService.searchSong(song)
    if (!songId) continue
    await youtubeService.addSongToPlaylist(playlistId, songId)
    console.log(`Song added to playlist: ${song}`)
  }
}

async function askCode () {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      if (!code) reject(new Error('code is invalid'))

      resolve(code)
    })
  })
}

main()
