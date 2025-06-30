// server_music_player.js

// 创建样式元素
const style = document.createElement('style');
style.textContent = `
.server_music_player * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: white;
}

.server_music_player .music-player {
    position: fixed;
    left: 10px;
    bottom: 0;
    z-index: 100;
    transition: all 1.0s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    width: 250px;
    max-width: 60vw;
    font-size: 10px;
}

.server_music_player .player-tab {
    background: linear-gradient(to right, #ff9966, #ff5e62);
    color: white;
    padding: 10px 15px;
    border-radius: 10px 10px 0 0;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
}

.server_music_player .player-tab span {
    font-weight: 300;
}

.server_music_player .player-tab i {
    transition: transform 1.0s ease;
}

.server_music_player .player-panel {
    background: rgba(20, 20, 35, 0.95);
    backdrop-filter: blur(10px);
    padding: 5px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.4s ease;
}

.server_music_player .music-player.expanded .player-panel {
    max-height: 600px;
    opacity: 1;
    padding: 20px;
}

.server_music_player .music-player.expanded .player-tab i {
    transform: rotate(180deg);
}

.server_music_player .now-playing {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.server_music_player .album-cover {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(45deg, #ff9966, #ff5e62);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.server_music_player .album-cover i {
    font-size: 1.5rem;
    color: white;
}

.server_music_player .current-song-info {
    flex: 1;
}

.server_music_player .current-song-title {
    font-size: 1.2em;
    font-weight: 600;
    margin-bottom: 5px;
}

.server_music_player .current-song-artist {
    font-size: 1em;
    opacity: 0.8;
    margin-bottom: 8px;
}

.server_music_player .progress-container {
    background: rgba(255, 255, 255, 0.1);
    height: 4px;
    border-radius: 5px;
    margin: 15px 0;
    cursor: pointer;
    position: relative;
}

.server_music_player .progress-bar {
    background: linear-gradient(to right, #ff9966, #ff5e62);
    height: 100%;
    width: 30%;
    border-radius: 5px;
    position: relative;
}

.server_music_player .progress-bar::after {
    content: '';
    position: absolute;
    right: 0;
    top: -3px;
    width: 11px;
    height: 11px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 153, 102, 0.8);
}

.server_music_player .time-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    opacity: 0.7;
    margin-bottom: 20px;
}

.server_music_player .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
}

.server_music_player .control-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.server_music_player .control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.server_music_player .control-btn.play-pause {
    width: 30px;
    height: 30px;
    background: linear-gradient(to right, #ff9966, #ff5e62);
}

.server_music_player .control-btn.play-pause:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 153, 102, 0.5);
}

.server_music_player .volume-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.server_music_player .volume-container i {
    font-size: 1.2rem;
    color: #ff9966;
}

.server_music_player .volume-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
}

.server_music_player .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(255, 153, 102, 0.8);
}

.server_music_player .playlist-select {
    width: 100%;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    margin-top: 10px;
    cursor: pointer;
    outline: none;
}

.server_music_player .playlist-select option {
    background: rgba(20, 20, 35, 0.95);
    padding: 10px;
}

@media (max-width: 768px) {
    .server_music_player .music-player {
        width: 200px;
        left: 10px;
    }
}
`;
document.head.appendChild(style);

// 创建播放器容器
const playerContainer = document.createElement('div');
playerContainer.className = 'server_music_player';
document.body.appendChild(playerContainer);

// 创建播放器HTML结构
playerContainer.innerHTML = `
<div class="music-player">
    <div class="player-tab">
        <span><i class="fas fa-music"></i> 音乐播放器</span>
        <i class="fas fa-chevron-up"></i>
    </div>
    <div class="player-panel">
        <div class="now-playing">
            <div class="album-cover">
                <i class="fas fa-music"></i>
            </div>
            <div class="current-song-info">
                <div class="current-song-title">选择一首歌曲</div>
                <div class="current-song-artist">-</div>
                <div class="time-info">
                    <span class="current-time">0:00</span>
                    <span class="total-time">0:00</span>
                </div>
            </div>
        </div>
        
        <div class="progress-container">
            <div class="progress-bar"></div>
        </div>
        
        <div class="controls">
            <button class="control-btn" id="prev">
                <i class="fas fa-step-backward"></i>
            </button>
            <button class="control-btn play-pause" id="play-pause">
                <i class="fas fa-play"></i>
            </button>
            <button class="control-btn" id="next">
                <i class="fas fa-step-forward"></i>
            </button>
        </div>
        
        <div class="volume-container">
            <i class="fas fa-volume-up"></i>
            <input type="range" class="volume-slider" id="volume" min="0" max="1" step="0.1" value="0.7">
        </div>
        
        <select class="playlist-select" id="playlist-select">
            <!-- 播放列表选项将通过JS动态生成 -->
        </select>
    </div>
</div>

<audio id="audio-player"></audio>
`;

// 添加Font Awesome图标库
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// 音乐播放器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 音乐数据 - 用户可以通过window.serverMusicList自定义
    const playlist = window.serverMusicList || [
      {}
    ];
    
    // DOM元素
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const volumeSlider = document.getElementById('volume');
    const playlistSelect = document.getElementById('playlist-select');
    const playerTab = document.querySelector('.server_music_player .player-tab');
    const musicPlayer = document.querySelector('.server_music_player .music-player');
    const progressBar = document.querySelector('.server_music_player .progress-bar');
    const progressContainer = document.querySelector('.server_music_player .progress-container');
    const currentTimeEl = document.querySelector('.server_music_player .current-time');
    const totalTimeEl = document.querySelector('.server_music_player .total-time');
    const currentSongTitle = document.querySelector('.server_music_player .current-song-title');
    const currentSongArtist = document.querySelector('.server_music_player .current-song-artist');
    
    // 当前歌曲索引
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // 加载歌曲
    function loadSong(index) {
        currentSongIndex = index;
        const song = playlist[index];
        
        audioPlayer.src = song.url;
        audioPlayer.load();
        
        currentSongTitle.textContent = song.name;
        currentSongArtist.textContent = song.artist;
        
        // 更新下拉菜单
        playlistSelect.innerHTML = playlist.map((song, index) => 
            `<option value="${index}" ${index === currentSongIndex ? 'selected' : ''}>
                ${song.name} - ${song.artist}
            </option>`
        ).join('');
        
        // 如果是播放状态，则播放歌曲
        if (isPlaying) {
            playSong();
        }
    }
    
    // 播放歌曲
    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    // 暂停歌曲
    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // 下一首
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= playlist.length) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        playSong();
    }
    
    // 上一首
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = playlist.length - 1;
        }
        loadSong(currentSongIndex);
        playSong();
    }
    
    // 更新进度条
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // 更新时间
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        
        if (!isNaN(duration)) {
            const durationMinutes = Math.floor(duration / 60);
            const durationSeconds = Math.floor(duration % 60);
            totalTimeEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        }
    }
    
    // 设置进度条
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // 初始化
    if (playlist.length > 0) {
        loadSong(0);
    } else {
        currentSongTitle.textContent = "暂无歌曲";
        currentSongArtist.textContent = "请添加音乐";
    }
    
    // 事件监听器
    playPauseBtn.addEventListener('click', () => {
        if (playlist.length === 0) return;
        
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    
    progressContainer.addEventListener('click', setProgress);
    
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
    });
    
    playlistSelect.addEventListener('change', () => {
        loadSong(parseInt(playlistSelect.value));
        playSong();
    });
    
    // 播放器展开/收起
    playerTab.addEventListener('click', () => {
        musicPlayer.classList.toggle('expanded');
    });
});

// 提供API供用户自定义播放列表
window.ServerMusicPlayer = {
    setPlaylist: function(newPlaylist) {
        window.serverMusicList = newPlaylist;
        // 重新初始化播放器
        if (document.readyState === 'complete') {
            initPlayer();
        } else {
            window.addEventListener('load', initPlayer);
        }
    }
};

function initPlayer() {
    // 重新加载播放列表
    const playlist = window.serverMusicList || [];
    const audioPlayer = document.getElementById('audio-player');
    const currentSongTitle = document.querySelector('.server_music_player .current-song-title');
    const currentSongArtist = document.querySelector('.server_music_player .current-song-artist');
    const playlistSelect = document.getElementById('playlist-select');
    
    if (playlist.length > 0) {
        // 重置播放器状态
        audioPlayer.src = playlist[0].url;
        audioPlayer.load();
        currentSongTitle.textContent = playlist[0].name;
        currentSongArtist.textContent = playlist[0].artist;
        
        // 更新下拉菜单
        playlistSelect.innerHTML = playlist.map((song, index) => 
            `<option value="${index}">${song.name} - ${song.artist}</option>`
        ).join('');
    } else {
        currentSongTitle.textContent = "暂无歌曲";
        currentSongArtist.textContent = "请添加音乐";
        playlistSelect.innerHTML = '';
    }
}