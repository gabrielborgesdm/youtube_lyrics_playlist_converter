import YoutubeService from './src/service/youtube.service.js'
import SongService from './src/service/song.service.js'

async function main () {
  const youtubeService = new YoutubeService()
  const songsService = new SongService()

  let songs = await youtubeService.getPlaylistItemsTitles()
  songs = songsService.sanitizeSongTitles(songs)

  console.log(songs, songs.length)
}

main()
