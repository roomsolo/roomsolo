

const DISCORD_USER_ID = '1288507939253911623'; 


const statusTextElement = document.querySelector('#now-playing .status-text');
const songElement = document.querySelector('#now-playing .song-title');
const artistElement = document.querySelector('#now-playing .artist-name');

async function fetchLanyardData() {

    if (DISCORD_USER_ID === '1288507939253911623') {
        statusTextElement.textContent = '❌ Lütfen Discord ID\'nizi güncelleyin.';
        return;
    }

    try {

        const response = await fetch('/.netlify/functions/lanyard');
        
        if (!response.ok) {
            throw new Error('API yanıtı hatalı');
        }
        
        const apiData = await response.json();
        const data = apiData.data;


        const ytMusicActivity = data.activities?.find(activity => 
            activity.name === 'YouTube Music'
        );

        if (ytMusicActivity && ytMusicActivity.details) {
            const song = ytMusicActivity.details;
            const artist = ytMusicActivity.state || 'Bilinmeyen Sanatçı';
            
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
    } catch (error) {
        console.error('Hata:', error);
        statusTextElement.textContent = 'Bağlantı hatası';
        songElement.textContent = '';
        artistElement.textContent = '';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    fetchLanyardData();
    setInterval(fetchLanyardData, 10000);
});