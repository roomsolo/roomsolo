
const DISCORD_USER_ID = '1288507939253911623'; 
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

const statusTextElement = document.querySelector('#now-playing .status-text');
const songElement = document.querySelector('#now-playing .song-title');
const artistElement = document.querySelector('#now-playing .artist-name');

function fetchLanyardData() {

    if (DISCORD_USER_ID === '1288507939253911623') {
        statusTextElement.textContent = '❌ Lütfen index.js dosyasındaki Discord ID\'nizi güncelleyin.';
        songElement.textContent = '';
        artistElement.textContent = '';
        return;
    }

    fetch(LANYARD_API_URL)
        .then(response => {
            if (!response.ok) {
                statusTextElement.textContent = 'Bağlantı Hatası.';
                throw new Error('Lanyard API yanıtı hatalı.');
            }
            return response.json();
        })
        .then(apiData => {
            const data = apiData.data;
            

            const ytMusicActivity = data.activities.find(activity => 
                activity.name === 'YouTube Music' && 
                activity.application_id === '1177081335727267940'
            );

            if (ytMusicActivity) {

                const song = ytMusicActivity.details; // "Highway Song"
                const artist = ytMusicActivity.state; // "System Of A Down"
                

                statusTextElement.textContent = '🎧 Şu anda dinliyor:';
                songElement.textContent = song;
                artistElement.textContent = `by ${artist}`;
                
            } else if (data.listening_to_spotify && data.spotify) {

                const song = data.spotify.song;
                const artist = data.spotify.artist;
                
                statusTextElement.textContent = '🎧 Şu anda dinliyor:';
                songElement.textContent = song;
                artistElement.textContent = `by ${artist}`;
                
            } else {

                statusTextElement.textContent = 'Şu an müzik dinlemiyorum';
                songElement.textContent = '';
                artistElement.textContent = '';
            }
        })
        .catch(error => {
            console.error('Lanyard verisi çekilemedi:', error);
            statusTextElement.textContent = 'Veri Bağlantı Hatası.';
            songElement.textContent = '';
            artistElement.textContent = '';
        });
}


fetchLanyardData();
setInterval(fetchLanyardData, 10000);