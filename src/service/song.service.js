import { removeWordsFromString } from '../helper/string.helper.js'
import PromptService from './prompt.service.js'

export default class SongService {
  static async filterAndSanitizeSongTitles (songs) {
    const filteredSongs = await this.#filterSongsByUserChoice(songs)

    return filteredSongs.map((title) => {
      const newTitle = removeWordsFromString(['official', 'video', 'lyrics', 'lyric'], title)
      return `${newTitle} lyrics`
    })
  }

  static async #filterSongsByUserChoice (songs) {
    const startingPosition = await PromptService.askForValue(
      `You have ${songs.length} songs on this playlist, do you want to start adding from which position? [1-${songs.length}]`,
      { isNumber: true, required: false })

    if (startingPosition < 1 || startingPosition > songs.length) {
      throw new Error(`position should be between 1 and ${songs.length}`)
    }

    return songs.slice(startingPosition - 1, songs.length)
  }
}
