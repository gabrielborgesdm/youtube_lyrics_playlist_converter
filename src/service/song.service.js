import { removeWordsFromString } from '../helper/string.helper.js'

export default class SongService {
  sanitizeSongTitles (songs) {
    return songs.map((title) => {
      const newTitle = removeWordsFromString(['official', 'video', 'lyrics', 'lyric'], title)
      return `${newTitle} lyrics`
    })
  }
}
