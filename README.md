# youtube_lyrics_playlist_converter

I wanted to create an app that reconstructs youtube playlists exclusively with lyric versions. I needed this because when importing songs from Spotify, existing tools in the market, like Spotify Downloader, often fetch the 'Official version,' which includes additional audio elements or annotations beyond the song itself.

## Installation
Rename .env.example to .env and replace the placeholder values with your own.
Next, install and execute with the following commands:

```bash
npm install
npm run start
```

## Setting up youtube api key
1. Go to the Google Cloud Console.
2. Create a new project or select an existing one.
3. Navigate to the "APIs & Services" > "Enabled APIs & services" section.
4. Enable a new api and select "YouTube Data API v3"

## Setting up OAuth
1. Navigate to the "APIs & Services" > "Credentials" section.
2. Click on "Create Credentials" and choose "OAuth client ID."
3. Fill the form and select all the roles for the Youtube Data API
4. Add your user account to the test users.
5. Get back to the "Credentials" screen, select "Create Credentials" and choose "OAuth client ID."
6. Select Desktop application type.
7. put your oAuth client id and secret on the .env file
