// 完整的歌曲数据（补充所有10首歌曲）
const songs = {
    song1: {
        title: "歌曲1",
        artist: "歌手A",
        cover: "https://picsum.photos/400/400?random=1",
        audio: "", // 替换为真实MP3链接
        lyrics: ["这是第一句歌词", "这是第二句歌词", "这是第三句歌词"]
    },
    song2: {
        title: "歌曲2",
        artist: "歌手B",
        cover: "https://picsum.photos/400/400?random=2",
        audio: "",
        lyrics: ["歌词行1", "歌词行2", "歌词行3"]
    },
    song3: {
        title: "歌曲3",
        artist: "歌手C",
        cover: "https://picsum.photos/80/80?random=3",
        audio: "",
        lyrics: ["歌曲3-歌词1", "歌曲3-歌词2", "歌曲3-歌词3"]
    },
    song4: {
        title: "歌曲4",
        artist: "歌手D",
        cover: "https://picsum.photos/80/80?random=4",
        audio: "",
        lyrics: ["歌曲4-歌词1", "歌曲4-歌词2", "歌曲4-歌词3"]
    },
    song5: {
        title: "歌曲5",
        artist: "歌手E",
        cover: "https://picsum.photos/80/80?random=5",
        audio: "",
        lyrics: ["歌曲5-歌词1", "歌曲5-歌词2", "歌曲5-歌词3"]
    },
    song6: {
        title: "歌曲6",
        artist: "歌手F",
        cover: "./picture/letter.png",
        audio: "",
        lyrics: ["歌曲6-歌词1", "歌曲6-歌词2", "歌曲6-歌词3"]
    },
    song7: {
        title: "歌曲7",
        artist: "歌手G",
        cover: "./picture/gaza.jpg",
        audio: "",
        lyrics: ["歌曲7-歌词1", "歌曲7-歌词2", "歌曲7-歌词3"]
    },
    song8: {
        title: "歌曲8",
        artist: "歌手H",
        cover: "./picture/summer.jpg",
        audio: "",
        lyrics: ["歌曲8-歌词1", "歌曲8-歌词2", "歌曲8-歌词3"]
    },
    song9: {
        title: "歌曲9",
        artist: "歌手I",
        cover: "https://picsum.photos/200/200?random=9",
        audio: "",
        lyrics: ["歌曲9-歌词1", "歌曲9-歌词2", "歌曲9-歌词3"]
    },
    song10: {
        title: "歌曲10",
        artist: "歌手J",
        cover: "https://picsum.photos/200/200?random=10",
        audio: "",
        lyrics: ["歌曲10-歌词1", "歌曲10-歌词2", "歌曲10-歌词3"]
    }
};

// 首页跳转逻辑（核心：确保URL参数正确传递）
function goToDetail(songId) {
    // 验证songId存在，避免无效跳转
    if (songs[songId]) {
        window.location.href = `detail.html?song=${songId}`;
    } else {
        alert("该歌曲信息不存在！");
    }
}

// 详情页逻辑（DOM加载完成后执行）
document.addEventListener('DOMContentLoaded', () => {
    // 仅在详情页执行逻辑
    if (window.location.pathname.includes('detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const songId = urlParams.get('song');
        
        // 验证歌曲ID有效性
        if (!songId || !songs[songId]) {
            alert("无效的歌曲链接！");
            window.location.href = 'index.html'; // 跳回首页
            return;
        }

        const song = songs[songId];

        // 填充歌曲信息
        document.getElementById('song-cover').src = song.cover;
        document.getElementById('song-title').textContent = song.title;
        document.getElementById('song-artist').textContent = song.artist;
        document.getElementById('audio-player').src = song.audio;

        // 填充歌词
        const lyricsBox = document.getElementById('lyrics-box');
        lyricsBox.innerHTML = "";
        song.lyrics.forEach(line => {
            const p = document.createElement('p');
            p.className = 'lyric-line';
            p.textContent = line;
            lyricsBox.appendChild(p);
        });

        // 播放器控制逻辑
        const audio = document.getElementById('audio-player');
        const playBtn = document.getElementById('play-btn');
        const progressFill = document.getElementById('progress-fill');
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
        const volumeSlider = document.querySelector('.volume-slider');

        // 播放/暂停
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = "⏸";
            } else {
                audio.pause();
                playBtn.textContent = "▶";
            }
        });

        // 更新进度条
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = `${percent}%`;
                currentTimeEl.textContent = formatTime(audio.currentTime);
            }
        });

        // 加载完成显示总时长
        audio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audio.duration);
        });

        // 音量控制
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value / 100;
        });

        // 时间格式化工具函数
        function formatTime(seconds) {
            if (isNaN(seconds)) return "00:00";
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }
});