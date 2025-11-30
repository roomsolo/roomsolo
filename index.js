const DISCORD_USER_ID = '1288507939253911623';

const statusTextElement = document.getElementById('status-text') || document.querySelector('#now-playing .status-text');
const songElement = document.getElementById('song-title') || document.querySelector('#now-playing .song-title');
const artistElement = document.getElementById('artist-name') || document.querySelector('#now-playing .artist-name');
const albumArtElement = document.querySelector('.album-art');

console.log('Elementler bulundu:', { statusTextElement, songElement, artistElement, albumArtElement });

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
        if (albumArtElement) albumArtElement.style.display = 'none';
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
        const albumArt = ytMusicActivity.assets?.large_image;
        
        console.log('Şarkı bulundu:', { song, artist, albumArt });
        

        if (albumArt && albumArtElement) {

            albumArtElement.src = albumArt;
            albumArtElement.style.display = 'block';
            console.log('Album art koyuldu:', albumArt);
        }
        
        updateElements('🎧 Şu anda dinliyor:', song, `by ${artist}`);
        
    } else if (data.listening_to_spotify && data.spotify) {
        const song = data.spotify.song;
        const artist = data.spotify.artist;
        
        updateElements('🎧 Şu anda dinliyor:', song, `by ${artist}`);
        
    } else {
        console.log('Müzik aktivitesi bulunamadı');
        updateElements('Şu an müzik dinlemiyorum', '', '');
 
        if (albumArtElement) {
            albumArtElement.style.display = 'none';
        }
    }
}
function updateElements(status, song, artist) {
    if (statusTextElement) statusTextElement.textContent = status;
    if (songElement) songElement.textContent = song;
    if (artistElement) artistElement.textContent = artist;
}

function decodeAlbumArtUrl(url) {
    if (!url) return null;
    
    console.log('Original URL:', url);
    
t
    if (url.startsWith('mp:external/')) {
      
        try {
            
            const parts = url.split('/');
       
            const encodedPart = parts.slice(2).join('/');
            
      
            if (encodedPart.startsWith('https://')) {
                return encodedPart;
            }
            
        
            let decodedUrl = encodedPart
                .replace(/&/g, '&')
                .replace(/%3D/g, '=')
                .replace(/%3F/g, '?');
                
            console.log('Decoded URL:', decodedUrl);
            return decodedUrl;
            
        } catch (error) {
            console.error('URL decode hatası:', error);
            return null;
        }
    }
    
    return url;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi, fonksiyon başlatılıyor...');
    fetchLanyardData();
    setInterval(fetchLanyardData, 10000);
});