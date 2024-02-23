import { google } from 'googleapis'
import AuthService from './auth.service.js'

export default class YoutubeService {
  constructor () {
    this.youtube = null
  }

  async initClient () {
    const authService = new AuthService()
    const auth = await authService.authenticate()
    this.youtube = google.youtube({ version: 'v3', auth })
  }

  async getPlaylistSongTitles (playlistId) {
    console.log('Retrieving songs from playlist...')
    const songs = await this.#findSongs(playlistId)
    if (songs.length === 0) throw new Error('No songs were found for this playlist')

    return songs
  }

  async #findSongs (playlistId, songs = [], pageToken = null) {
    const data = await this.#searchPlaylistVideos(playlistId, pageToken)
    const videos = data?.items

    if (videos?.length === 0) {
      return
    }
    const currentVideos = videos.map(video => video.snippet.title)
    songs.push(...currentVideos)

    if (currentVideos.length === 50) {
      await this.#findSongs(playlistId, songs, data.nextPageToken)
    }

    return songs
  }

  async #searchPlaylistVideos (playlistId, pageToken) {
    await this.#waitInterval()
    const playlistParams = {
      part: [
        'snippet,contentDetails'
      ],
      maxResults: 50,
      playlistId,
      pageToken
    }

    return await new Promise((resolve, reject) => {
      this.youtube.playlistItems.list(playlistParams, async (err, res) => {
        if (err) {
          console.error('Error calling YouTube API:', err)
          reject(err)
        }

        resolve(res.data)
      })
    })
  }

  async findOrCreatePlaylist (title) {
    await this.#waitInterval()
    try {
      return await this.findPlaylistByTitle(title)
    } catch (error) {
      return await this.createPlaylist(title)
    }
  }

  async findPlaylistByTitle (title) {
    const response = await this.youtube.playlists.list({
      part: 'snippet',
      q: title,
      type: 'playlist',
      mine: process.env.ONLY_PRIVATE_PLAYLISTS | true
    })

    const playlist = response.data.items?.filter((item) => item.snippet.title === title)
    if (!playlist?.length) {
      throw new Error(`Playlist '${title}' not found`)
    }

    return playlist[0].id
  }

  async createPlaylist (title) {
    const response = await this.youtube.playlists.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          title
        }
      }
    })

    console.log(`Playlist '${title}' created with id: ${response.data.id}`)

    return response.data.id
  }

  async searchSong (songTitle) {
    console.log(`Searching for song ${songTitle}...`)
    await this.#waitInterval()

    try {
      const response = await this.youtube.search.list({
        part: 'snippet',
        q: songTitle,
        type: 'video'
      })

      if (response.data.items.length > 0) {
        return response.data.items[0].id.videoId
      } else {
        console.log(`Song not found: ${songTitle}`)
      }
    } catch (error) {
      console.log(`could not search: ${songTitle}`)
      console.log(error.response.data)
    }
    return undefined
  }

  async addSongToPlaylist (playlistId, videoId) {
    console.log(`adding song with id${videoId}...`)
    await this.#waitInterval()

    try {
      await this.youtube.playlistItems.insert({
        part: 'snippet',
        requestBody: {
          snippet: {
            playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId
            }
          }
        }
      })
    } catch (error) {
      console.log('could not song, skipping to the next')
      return false
    }

    return true
  }

  async #waitInterval (milliseconds = 3000) {
    await new Promise((resolve) => {
      setTimeout(() => resolve(), milliseconds)
    })
  }
}
