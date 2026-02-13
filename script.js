/**
 * CONFIGURAÇÃO DO ÁLBUM
 */
const albumData = [
    {
        src: "imagem/IMG_20250426_231247_918.jpg",
        legenda: "Onde tudo começou... ❤️",
        data: "26/Abril/2025",
        local: "Nosso Primeiro Encontro",
        mensagem: "lembro como hoje, o nervosismo que eu estava, o medo de não da certo, mas quando estava com você me sentir completo, e hoje vejo que você é a mulher da minha vida, te amo",
        musica: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        src: "imagem/IMG_20250823_140717_683.jpg",
        legenda: "Seu sorriso é meu  refúgio ✨",
        data: "23/Agosto/2025",
        local: "Tarde Especial",
        mensagem: "Existem momentos que a gente guarda no coração como se fossem tesouros. Esse dia foi um deles, onde cada risada sua me fazia ter certeza do quanto te amo.",
        musica: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        src: "imagem/IMG-20250824-WA0034.jpg",
        legenda: "Cumplicidade em cada detalhe 🌹",
        data: "24/Agosto/2025",
        local: "Momentos Nossos",
        mensagem: "Amo a forma como a gente se entende, como a gente se completa. Cada detalhe seu é uma poesia que eu nunca canso de ler.",
        musica: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    },
    {
        src: "imagem/VID_20251004_161612_435.jpg",
        legenda: "Ainda sinto o gosto desse dia perfeito 🥂",
        data: "04/Outubro/2025",
        local: "Jantar Romântico",
        mensagem: "Nossas conversas, os risos, Cada detalhe desse jantar ficou gravado não e todo dia que conheco me sogro e que ele me recebe tao bem",
        musica: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        src: "imagem/PXL_20251231_232447186.jpg",
        legenda: "O primeiro de muitos anos ao seu lado ✨",
        data: "31/Dezembro/2025",
        local: "Véspera de Ano Novo",
        mensagem: "Enquanto o mundo esperava pela virada, meu único desejo era que o tempo parasse ali, com você, pra sempre.",
        musica: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    },
    {
        src: "imagem/PXL_20260101_001938265.jpg",
        legenda: "🎆",
        data: "01/Janeiro/2026",
        local: "Início de um novo ciclo",
        mensagem: "Seu sorriso ilumina até os meus dias mais cinzas. Começar o ano com você é a maior benção que eu poderia pedir feliz 5 meses de namoro meu amor, te amo muito de uma forma que nem sei explicar, palavras se tornan pequenas pra descrever o tamanho do meu amor por você",
        musica: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
];

// --- VARIÁVEIS GLOBAIS ---
let currentIndex = 0;
let isPlaying = false;
let isMusicPlaying = false; // Estado para controlar se a música deve tocar
let slideInterval;
let favorites = JSON.parse(localStorage.getItem('albumFavorites')) || [];

// --- ELEMENTOS ---
const currentPhoto = document.getElementById('current-photo');
const photoCaption = document.getElementById('photo-caption');
const dateText = document.querySelector('.date-text');
const locationText = document.querySelector('.location-text');
const thumbnailsList = document.getElementById('thumbnails-list');
const currentIndexSpan = document.getElementById('current-index');
const totalPhotosSpan = document.getElementById('total-photos');

// Modais e Overlays
const welcomeScreen = document.getElementById('welcome-screen');
const btnEnter = document.getElementById('btn-enter');
const letterModal = document.getElementById('letter-modal');
const letterOverlay = document.getElementById('letter-overlay');
const btnOpenLetter = document.getElementById('btn-open-letter');
const letterText = document.getElementById('letter-text');
// Removed flipCard variable

// Player de Música
const bgMusic = document.getElementById('bg-music');
const btnMusic = document.getElementById('btn-music');

// Controles
const btnPrev = document.querySelector('.nav-btn.prev');
const btnNext = document.querySelector('.nav-btn.next');
const btnPlay = document.getElementById('btn-play');
const btnFavorite = document.getElementById('btn-favorite');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnDownload = document.getElementById('btn-download');

// --- INICIALIZAÇÃO ---
function init() {
    totalPhotosSpan.textContent = albumData.length;
    renderThumbnails();

    // Configura a música inicial sem tocar
    if (bgMusic && albumData[currentIndex].musica) {
        bgMusic.src = albumData[currentIndex].musica;
    }

    loadPhoto(currentIndex);
    checkFavoriteStatus();

    // Listeners
    setupEventListeners();
    setupSwipe();
}

function setupEventListeners() {
    // Welcome Screen
    if (btnEnter) btnEnter.addEventListener('click', enterAlbum);

    // Navegação
    if (btnPrev) btnPrev.addEventListener('click', () => changePhoto(-1));
    if (btnNext) btnNext.addEventListener('click', () => changePhoto(1));

    // Controles
    if (btnPlay) btnPlay.addEventListener('click', togglePlay);
    if (btnFavorite) btnFavorite.addEventListener('click', handleFavoriteClick);
    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
    if (btnDownload) btnDownload.addEventListener('click', downloadPhoto);
    if (btnMusic) btnMusic.addEventListener('click', toggleMusic);

    // Carta
    if (btnOpenLetter) btnOpenLetter.addEventListener('click', openLetter);
    if (letterOverlay) letterOverlay.addEventListener('click', closeLetter);
    // Removed flip card click listener

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changePhoto(-1);
        if (e.key === 'ArrowRight') changePhoto(1);
        if (e.key === 'Escape') closeLetter();
        if (e.key === ' ') togglePlay();
    });
}

function enterAlbum() {
    welcomeScreen.classList.add('hidden');
    // Não força play aqui, deixa o usuário controlar pelo botão de música
}

// --- LÓGICA DE FOTOS ---
function loadPhoto(index) {
    currentPhoto.classList.add('fade-out');

    setTimeout(() => {
        const photo = albumData[index];

        // Define o que acontece quando a imagem carrega
        currentPhoto.onload = () => {
            currentPhoto.classList.remove('fade-out');
            photoCaption.style.opacity = 1;
            photoCaption.style.transition = 'opacity 1s ease';
        };

        // Fallback em caso de erro no carregamento da imagem
        currentPhoto.onerror = () => {
            currentPhoto.classList.remove('fade-out');
            photoCaption.style.opacity = 1;
            console.error("Erro ao carregar imagem:", photo.src);
        };

        currentPhoto.src = photo.src;

        photoCaption.style.opacity = 0;
        photoCaption.textContent = photo.legenda;

        if (dateText) dateText.textContent = photo.data || '';
        if (locationText) locationText.textContent = photo.local || '';
        if (letterText) letterText.textContent = photo.mensagem || "Escreva uma mensagem especial...";
        if (currentIndexSpan) currentIndexSpan.textContent = index + 1;

        // --- MÚSICA POR FOTO (Híbrido) ---
        if (photo.musica) {
            updateMusicPlayer(photo.musica);
        }

        // Atualiza Thumbnails
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        const activeThumb = document.querySelector(`.thumb[data-index="${index}"]`);
        if (activeThumb) {
            activeThumb.classList.add('active');
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        checkFavoriteStatus();
    }, 300);
}

function changePhoto(direction) {
    currentIndex = (currentIndex + direction + albumData.length) % albumData.length;
    closeLetter(); // Fecha a carta ao mudar de foto para focar na nova imagem
    loadPhoto(currentIndex);
}

function renderThumbnails() {
    thumbnailsList.innerHTML = '';
    albumData.forEach((photo, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        thumb.dataset.index = index;
        thumb.innerHTML = `<img src="${photo.src}" alt="Thumbnail ${index + 1}">`;

        thumb.addEventListener('click', () => {
            currentIndex = index;
            loadPhoto(currentIndex);
            if (isPlaying) togglePlay();
        });

        thumbnailsList.appendChild(thumb);
    });
}

// --- MÚSICA ---
// --- MÚSICA HÍBRIDA (YouTube, Spotify, MP3) ---
function updateMusicPlayer(url) {
    const container = document.getElementById('music-player-container');
    const audioPlayer = document.getElementById('bg-music');

    // Pausa player nativo
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }

    // Limpa container de embeds
    if (container) container.innerHTML = '';

    if (!url) return;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // YouTube
        const videoId = getYouTubeID(url);
        if (videoId && container) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1`;
            iframe.allow = "autoplay; encrypted-media";
            iframe.style.width = "1px";
            iframe.style.height = "1px";
            container.appendChild(iframe);
            isMusicPlaying = true;
        }
    } else if (url.includes('spotify.com')) {
        // Spotify
        const spotifyId = getSpotifyID(url);
        if (spotifyId && container) {
            const iframe = document.createElement('iframe');
            // Nota: Spotify só permite autoplay de 30s se não logado
            iframe.src = `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`;
            iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
            iframe.style.width = "300px"; // Spotify precisa de tamanho minimo pra aparecer o controle
            iframe.style.height = "80px";
            iframe.style.borderRadius = "12px";

            // Torna o container visível momentaneamente para o Spotify
            const musicContainer = document.getElementById('music-player-container');
            if (musicContainer) {
                musicContainer.style.bottom = "20px";
                musicContainer.style.left = "20px";
                musicContainer.style.width = "auto";
                musicContainer.style.height = "auto";
                musicContainer.style.opacity = "0.9";
                musicContainer.style.pointerEvents = "auto";
                musicContainer.style.zIndex = "100";
            }

            container.appendChild(iframe);
            isMusicPlaying = true;
        }
    } else {
        // MP3 Nativo
        if (audioPlayer) {
            audioPlayer.src = url;
            audioPlayer.play().catch(e => console.log("Erro autoplay MP3:", e));
            isMusicPlaying = true;
        }
    }

    if (btnMusic) btnMusic.classList.add('active');
}

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getSpotifyID(url) {
    // Ex: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
}

function toggleMusic() {
    // Lógica simplificada: apenas muta/desmuta visuals ou para players
    const container = document.getElementById('music-player-container');
    const audioPlayer = document.getElementById('bg-music');

    if (isMusicPlaying) {
        // Parar tudo
        if (container) container.innerHTML = '';
        if (audioPlayer) audioPlayer.pause();
        isMusicPlaying = false;
        if (btnMusic) btnMusic.classList.remove('active');
    } else {
        // Retomar (recarrega a música da foto atual)
        updateMusicPlayer(albumData[currentIndex].musica);
    }
}

// --- SLIDESHOW ---
function togglePlay() {
    isPlaying = !isPlaying;
    const icon = btnPlay.querySelector('i');

    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        slideInterval = setInterval(() => changePhoto(1), 3000);
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        clearInterval(slideInterval);
    }
}

// --- CHUVA DE CORAÇÕES ---
function handleFavoriteClick() {
    toggleFavorite();
    if (btnFavorite.classList.contains('active')) {
        createHeartRain();
    }
}

function createHeartRain() {
    const container = document.getElementById('heart-rain-container');
    const duration = 10000;
    const endTime = Date.now() + duration;

    const interval = setInterval(() => {
        if (Date.now() > endTime) {
            clearInterval(interval);
            return;
        }

        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        const hearts = ['❤️', '💖', '💕', '💘', '💝', '✨'];
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 20 + 20;
        heart.style.fontSize = size + 'px';

        const animDuration = Math.random() * 3 + 2;
        heart.style.animationDuration = animDuration + 's';

        container.appendChild(heart);
        setTimeout(() => heart.remove(), animDuration * 1000);

    }, 200);
}

function toggleFavorite() {
    const photoUrl = albumData[currentIndex].src;
    const indexInFavs = favorites.indexOf(photoUrl);

    if (indexInFavs === -1) {
        favorites.push(photoUrl);
        btnFavorite.classList.add('active');
    } else {
        favorites.splice(indexInFavs, 1);
        btnFavorite.classList.remove('active');
    }
    localStorage.setItem('albumFavorites', JSON.stringify(favorites));
}

function checkFavoriteStatus() {
    const photoUrl = albumData[currentIndex].src;
    if (favorites.includes(photoUrl)) {
        btnFavorite.classList.add('active');
        btnFavorite.querySelector('i').className = 'fas fa-heart';
    } else {
        btnFavorite.classList.remove('active');
        btnFavorite.querySelector('i').className = 'far fa-heart';
    }
}

// --- UI HELPERS ---
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        btnFullscreen.querySelector('i').className = 'fas fa-compress';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            btnFullscreen.querySelector('i').className = 'fas fa-expand';
        }
    }
}

function downloadPhoto() {
    const link = document.createElement('a');
    link.href = albumData[currentIndex].src;
    link.download = `nossa-memoria-${currentIndex + 1}`;
    link.target = '_blank';
    link.click();
}

function openLetter() {
    // Atualiza o texto antes de mostrar o modal
    if (letterText && albumData[currentIndex]) {
        // Usa innerHTML para permitir quebras de linha se houver
        letterText.innerHTML = albumData[currentIndex].mensagem || "Escreva uma mensagem especial...";
    }

    if (letterModal) {
        letterModal.classList.remove('hidden');
    }
}

function closeLetter() {
    letterModal.classList.add('hidden');
}

// --- MOBILE SWIPE ---
function setupSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;
    const viewer = document.querySelector('.main-viewer');

    // Check if viewer exists to prevent errors on some layouts
    if (!viewer) return;

    viewer.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX);
    viewer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) changePhoto(1);
        if (touchEndX > touchStartX + 50) changePhoto(-1);
    });
}

// Start
init();
