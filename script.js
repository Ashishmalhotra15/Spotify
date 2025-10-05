document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const songs = [
        { title: 'PERFECT', artist: 'Guru Randhawa', image: 'images/PERFECT.jpeg', audio: 'music/Perfect.mp3' },
        { title: 'Jaana Nahi', artist: 'Faheem Abdullah', image: 'images/Janan.jpg', audio: 'music/jaana-nahi.mp3' },
        { title: 'Tumse Behtar', artist: 'Arijit Singh', image: 'images/Behtar.png', audio: 'music/Tumse-Behtar.mp3' },
        { title: 'Sundari', artist: 'Sanju Rathod', image: 'images/Sundari.jpg', audio: 'music/Bijuria.mp3' },
        { title: 'Tum Mere Na Huye', artist: 'Sachin-Jigar', image: 'images/Merena.webp', audio: 'music/tum-mere.mp3' },
        { title: 'Kashish', artist: 'Ashish Bhatia', image: 'images/Kashish.jpg', audio: 'music/Kashish.mp3' }
    ];

    // --- ELEMENTS ---
    const audioPlayer = new Audio();
    const songCards = document.querySelectorAll('#trending-songs .card');
    
    // Player and Banner Elements
    const previewBanner = document.getElementById('preview-banner');
    const musicPlayer = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('player-play');
    const prevBtn = document.getElementById('player-prev');
    const nextBtn = document.getElementById('player-next');
    const progressBar = document.getElementById('player-progress');
    const volumeSlider = document.getElementById('player-volume');
    const shuffleBtn = document.getElementById('player-shuffle');
    const repeatBtn = document.getElementById('player-repeat');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('duration');
    const playerImage = document.getElementById('player-thumb');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');

    let currentSongIndex = -1;
    let isShuffle = false;

    // --- FUNCTIONS ---
    function playSong(index) {
        if (index < 0 || index >= songs.length) return;
        currentSongIndex = index;
        const songData = songs[currentSongIndex];
        
        audioPlayer.src = songData.audio;
        audioPlayer.play();

        updatePlayerUI(songData);
        playPauseBtn.className = 'fas fa-pause-circle';
    }

    function updatePlayerUI(songData) {
        playerImage.src = songData.image;
        playerTitle.textContent = songData.title;
        playerArtist.textContent = songData.artist;
        
        previewBanner.style.display = 'none';
        musicPlayer.style.display = 'grid'; // Use grid for player layout
    }

    function togglePlayPause() {
        if (currentSongIndex === -1) return;
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.className = 'fas fa-pause-circle';
        } else {
            audioPlayer.pause();
            playPauseBtn.className = 'fas fa-play-circle';
        }
    }

    function playNext() {
        if (isShuffle) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * songs.length);
            } while (songs.length > 1 && nextIndex === currentSongIndex);
            currentSongIndex = nextIndex;
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        playSong(currentSongIndex);
    }

    function playPrev() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- EVENT LISTENERS ---
    songCards.forEach((card, index) => {
        card.addEventListener('click', () => playSong(index));
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    
    audioPlayer.addEventListener('ended', () => {
        if (repeatBtn.classList.contains('active')) {
            playSong(currentSongIndex);
        } else {
            playNext();
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const progressValue = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
        progressBar.value = progressValue;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalDurationEl.textContent = formatTime(audioPlayer.duration);
    });

    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        repeatBtn.classList.toggle('active');
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return; // Don't trigger on search bar
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            playNext();
        } else if (e.code === 'ArrowLeft') {
            playPrev();
        }
    });
});