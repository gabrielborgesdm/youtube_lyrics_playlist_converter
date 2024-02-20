import { google } from 'googleapis'

export default class YoutubeService {
  constructor (auth = process.env.YOUTUBE_DATA_API_KEY) {
    this.youtube = google.youtube({ version: 'v3', auth })
  }

  async getPlaylistItemsTitles (songs = [], pageToken = null) {
    const data = await this.getPlaylistVideos(pageToken)
    const videos = data?.items

    if (videos?.length === 0) {
      return
    }
    const currentVideos = videos.map(video => video.snippet.title)
    songs.push(...currentVideos)

    if (currentVideos.length === 50) {
      await this.getPlaylistItemsTitles(songs, data.nextPageToken)
    }

    return songs
  }

  async getPlaylistVideos (pageToken) {
    const playlistParams = {
      part: [
        'snippet,contentDetails'
      ],
      maxResults: 50,
      playlistId: process.env.YOUTUBE_PLAYLIST_ID,
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

  async createPlaylist () {
    const response = await this.youtube.playlists.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          title: process.env.YOUTUBE_NEW_PLAYLIST_NAME
        }
      }
    })
    console.log(`Playlist ${process.env.YOUTUBE_NEW_PLAYLIST_NAME} created with id: ${response.data.id}`)

    return response.data.id
  }

  async searchSong (songTitle) {
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
      console.log('could not add videoId: ', videoId)
    }
  }
}
