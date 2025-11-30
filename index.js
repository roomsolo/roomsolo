

const DISCORD_USER_ID = '1288507939253911623';

const statusTextElement = document.getElementById('status-text') || document.querySelector('#now-playing .status-text');
const songElement = document.getElementById('song-title') || document.querySelector('#now-playing .song-title');
const artistElement = document.getElementById('artist-name') || document.querySelector('#now-playing .artist-name');

console.log('Elementler bulundu:', { statusTextElement, songElement, artistElement });

async function fetchLanyardData() {
    try {
        console.log('API çağrısı yapılıyor...');
        

        const response = await fetch('/.netlify/functions/lanyard');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData = await response.json();
        console.log('API verisi:', apiData);
        
        processLanyardData(apiData);
        
    } catch (error) {
        console.error('Hata:', error);
        if (statusTextElement) {
            statusTextElement.textContent = 'Bağlantı hatası';
        }
        if (songElement) songElement.textContent = '';
        if (artistElement) artistElement.textContent = '';
    }
}

function processLanyardData(apiData) {
    if (!apiData.success || !apiData.data) {
        console.log('API başarısız veya data yok');
        updateElements('API verisi alınamadı', '', '');
        return;
    }

    const data = apiData.data;
    console.log('Activities:', data.activities);
    const ytMusicActivity = data.activities?.find(activity => 
        activity && activity.name === 'YouTube Music'
    );

    console.log('YouTube Music activity:', ytMusicActivity);

    if (ytMusicActivity && ytMusicActivity.details) {
        const song = ytMusicActivity.details; 
        const artist = ytMusicActivity.state; 
        
        console.log('Şarkı bulundu:', { song, artist });
        updateElements('🎧 Şu anda dinliyor:', song, `by ${artist}`);
        
    } else if (data.listening_to_spotify && data.spotify) {
        const song = data.spotify.song;
        const artist = data.spotify.artist;
        
        updateElements('🎧 Şu anda dinliyor:', song, `by ${artist}`);
        
    } else {
        console.log('Müzik aktivitesi bulunamadı');
        updateElements('Şu an müzik dinlemiyorum', '', '');
    }
}

function updateElements(status, song, artist) {
    if (statusTextElement) statusTextElement.textContent = status;
    if (songElement) songElement.textContent = song;
    if (artistElement) artistElement.textContent = artist;
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi, fonksiyon başlatılıyor...');
    fetchLanyardData();
    setInterval(fetchLanyardData, 10000);
});