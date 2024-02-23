# youtube_lyrics_playlist_converter

I wanted to create an app that reconstructs youtube playlists exclusively with lyric versions. I needed this because when importing songs from Spotify, existing tools in the market, like Spotify Downloader, often fetch the 'Official version' which includes additional audio elements or annotations beyond the song itself.

## Installation
Rename .env.example to .env and replace the placeholder values with your own.
Next, install and execute with the following commands:

```bash
npm install
npm run start
```

## Setting up OAuth
1. Navigate to the "APIs & Services" > "Credentials" section.
2. Click on "Create Credentials" and choose "OAuth client ID."
3. Fill the form and select all the roles for the Youtube Data API
4. Add your user account to the test users.
5. Get back to the "Credentials" screen, select "Create Credentials" and choose "OAuth client ID."
6. Select Desktop application type.
7. Put your oAuth client id and secret on the .env file

## Usage
1. The application will start by asking you to log in with your Google account using 2FA.
2. It will then prompt you for the title of the playlist you want to convert to lyrics. If the environment variable ONLY_PRIVATE_PLAYLISTS is set to true, it will only search for your playlists.
3. You will be asked from which position you want to start converting the songs. This feature exists so that if an error occurs, you don't need to start from the beginning again.
4. After providing the necessary inputs, your playlist should be available on YouTube.