import YoutubeService from './src/service/youtube.service.js'
import SongService from './src/service/song.service.js'
import PromptService from './src/service/prompt.service.js'
import StateHolderModel from './src/model/state-holder.model.js'

async function main () {
  const youtubeService = new YoutubeService()
  await youtubeService.initClient()

  const currentPlaylistTitle = await PromptService.askForValue('Please provide the title of the current playlist you want to get songs from')
  const currentPlaylistId = await youtubeService.findPlaylistByTitle(currentPlaylistTitle)

  const lyricsTitle = await PromptService.askForValue('Now, provide the title for the Lyrics YouTube playlist, whether you are seeking an existing one or intend to create a new one')
  const lyricsPlaylistId = await youtubeService.findOrCreatePlaylist(lyricsTitle)

  let songsFromCurrentPlaylist = await youtubeService.getPlaylistSongTitles(currentPlaylistId)
  songsFromCurrentPlaylist = await SongService.filterAndSanitizeSongTitles(songsFromCurrentPlaylist)

  const stateHolder = new StateHolderModel()
  for (const song of songsFromCurrentPlaylist) {
    if (stateHolder.checkLastThreeStatesAreInvalid()) {
      console.log(`You probably hit the youtube quota, try again later from song position: ${stateHolder.states.length - 3}`)
      return
    }

    let songAddedWithSuccess = false
    const songId = await youtubeService.searchSong(song)

    if (songId) {
      songAddedWithSuccess = await youtubeService.addSongToPlaylist(lyricsPlaylistId, songId)
    }

    stateHolder.addState(songAddedWithSuccess)
  }
}

main()
