import { google } from 'googleapis'

async function main () {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY

  const youtube = google.youtube({ version: 'v3', auth: apiKey })
  const songs = []
  await findAndAppendPlaylistSongs(youtube, songs)

  console.log(songs, songs.length)
}

async function findAndAppendPlaylistSongs (youtube, songs, pageToken = null) {
  const data = await getPlaylistVideos(youtube, pageToken)
  const videos = data?.items

  if (videos?.length === 0) {
    return
  }
  const currentVideos = videos.map(video => video.snippet.title)
  songs.push(...currentVideos)

  if (currentVideos.length === 50) {
    await findAndAppendPlaylistSongs(youtube, songs, data.nextPageToken)
  }
}

async function getPlaylistVideos (youtube, pageToken) {
  const playlistParams = {
    part: [
      'snippet,contentDetails'
    ],
    maxResults: 50,
    playlistId: process.env.YOUTUBE_PLAYLIST_ID,
    pageToken
  }

  return await new Promise((resolve, reject) => {
    youtube.playlistItems.list(playlistParams, async (err, res) => {
      if (err) {
        console.error('Error calling YouTube API:', err)
        reject(err)
      }

      resolve(res.data)
    })
  })
}

main()
