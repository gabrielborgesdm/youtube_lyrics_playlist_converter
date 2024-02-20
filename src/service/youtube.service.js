import { google } from 'googleapis'

export default class YoutubeService {
  constructor () {
    this.youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_DATA_API_KEY })
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
}
