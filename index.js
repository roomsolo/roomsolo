
const DISCORD_USER_ID = '1288507939253911623'; 
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;


const statusTextElement = document.querySelector('#now-playing .status-text');
const songElement = document.querySelector('#now-playing .song-title');
const artistElement = document.querySelector('#now-playing .artist-name');

function checkDiscordId() {
    return DISCORD_USER_ID !== '1288507939253911623' && DISCORD_USER_ID.length > 10;
}

function fetchLanyardData() {

    if (!checkDiscordId()) {
        statusTextElement.textContent = '❌ Lütfen index.js dosyasındaki Discord ID\'nizi güncelleyin.';
        songElement.textContent = '';
        artistElement.textContent = '';
        return;
    }

    fetch(LANYARD_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(apiData => {
            const data = apiData.data;
            
            if (!data || data.success === false) {
                throw new Error('Kullanıcı bulunamadı veya veri alınamadı.');
            }

            if (data.listening_to_spotify && data.spotify) {
                const song = data.spotify.song;
                const artist = data.spotify.artist;
                
                statusTextElement.textContent = '🎧 Şu anda dinliyor:';
                songElement.textContent = song;
                artistElement.textContent = `by ${artist}`;
                return;
            }

            if (data.activities && data.activities.length > 0) {
                const ytMusicActivity = data.activities.find(activity => 
                    activity.name && (
                        activity.name.toLowerCase().includes('youtube music') ||
                        activity.name.toLowerCase().includes('youtube') ||
                        (activity.application_id === '463097721130188830') // YouTube Music app ID
                    )
                );

                if (ytMusicActivity) {
                    let song = 'Bilinmeyen Şarkı';
                    let artist = 'Bilinmeyen Sanatçı';

                    if (ytMusicActivity.details) {
                        song = ytMusicActivity.details;
                    } else if (ytMusicActivity.state) {
                        song = ytMusicActivity.state;
                    }

                    if (ytMusicActivity.state && ytMusicActivity.state !== song) {
                        artist = ytMusicActivity.state;
                    }

                    statusTextElement.textContent = '🎧 Şu anda dinliyor:';
                    songElement.textContent = song;
                    artistElement.textContent = `by ${artist}`;
                    return;
                }
            }


            statusTextElement.textContent = 'Şu an müzik dinlemiyorum';
            songElement.textContent = '';
            artistElement.textContent = '';

        })
        .catch(error => {
            console.error('Lanyard verisi çekilemedi:', error);
            statusTextElement.textContent = 'Bağlantı hatası';
            songElement.textContent = 'Lütfen daha sonra tekrar deneyin';
            artistElement.textContent = '';
        });
}


document.addEventListener('DOMContentLoaded', function() {
    fetchLanyardData();
    setInterval(fetchLanyardData, 10000);
});
