/**
 * CONFIGURAÇÃO DO ÁLBUM
 * =====================
 */
const albumData = [
    {
        src: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=1000&auto=format&fit=crop",
        legenda: "Onde tudo começou... cada pôr do sol me lembra você ❤️",
        data: "14/02/2023",
        local: "Praia dos Sonhos",
        mensagem: "Lembro desse dia como se fosse hoje. O céu estava pintado de cores que só a natureza consegue criar, mas a vista mais linda era você ao meu lado."
    },
    {
        src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop",
        legenda: "Seu sorriso ilumina até os meus dias mais cinzas ✨",
        data: "20/03/2023",
        local: "Nosso Parque",
        mensagem: "Seu sorriso tem esse poder incrível de mudar meu humor instantaneamente. Obrigado por ser minha luz."
    },
    {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop",
        legenda: "Ainda sinto o gosto desse dia perfeito 🥂",
        data: "12/06/2023",
        local: "Jantar Romântico",
        mensagem: "Nossas conversas, os risos, o brinde... Cada detalhe desse jantar ficou gravado no meu coração."
    },
];

// --- ESTADO DA APLICAÇÃO ---
let currentIndex = 0;
let isPlaying = false;
let slideInterval;
let favorites = JSON.parse(localStorage.getItem('albumFavorites')) || [];

// --- ELEMENTOS DO DOM ---
const currentPhoto = document.getElementById('current-photo');
const photoCaption = document.getElementById('photo-caption');
const dateText = document.querySelector('.date-text');
const locationText = document.querySelector('.location-text');
const thumbnailsList = document.getElementById('thumbnails-list');
const currentIndexSpan = document.getElementById('current-index');
const totalPhotosSpan = document.getElementById('total-photos');

// Elementos Novos
const welcomeScreen = document.getElementById('welcome-screen');
const btnEnter = document.getElementById('btn-enter');
const bgMusic = document.getElementById('bg-music');
const letterModal = document.getElementById('letter-modal');
const letterOverlay = document.getElementById('letter-overlay');
const btnOpenLetter = document.getElementById('btn-open-letter');
const letterText = document.getElementById('letter-text');
const flipCard = document.querySelector('.flip-card');

// Botões
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
    loadPhoto(currentIndex);
    checkFavoriteStatus();

    // Welcome & Music
    btnEnter.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        bgMusic.volume = 0.3; // Volume suave
        bgMusic.play().catch(e => console.log("Erro ao tocar música:", e));
    });

    // Flip Card / Carta
    btnOpenLetter.addEventListener('click', openLetter);
    letterOverlay.addEventListener('click', closeLetter);
    flipCard.addEventListener('click', () => {
        flipCard.classList.toggle('flipped');
    });

    // Event Listeners
    btnPrev.addEventListener('click', () => changePhoto(-1));
    btnNext.addEventListener('click', () => changePhoto(1));
    btnPlay.addEventListener('click', togglePlay);
    btnFavorite.addEventListener('click', handleFavoriteClick);
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnDownload.addEventListener('click', downloadPhoto);

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changePhoto(-1);
        if (e.key === 'ArrowRight') changePhoto(1);
        if (e.key === 'Escape') closeLetter();
    });

    // Mobile Swipe
    setupSwipe();
}

// --- CORE FUNCTIONS ---

function loadPhoto(index) {
    // Efeito de fade-out
    currentPhoto.classList.add('fade-out');

    setTimeout(() => {
        const photo = albumData[index];
        currentPhoto.src = photo.src;

        photoCaption.style.opacity = 0;
        photoCaption.textContent = photo.legenda;

        dateText.textContent = photo.data || '';
        locationText.textContent = photo.local || '';

        // Atualizar texto da carta
        letterText.textContent = photo.mensagem || "Escreva uma mensagem especial para esta foto aqui...";

        // Atualizar contador
        currentIndexSpan.textContent = index + 1;

        // Atualizar thumbnails
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        const activeThumb = document.querySelector(`.thumb[data-index="${index}"]`);
        if (activeThumb) {
            activeThumb.classList.add('active');
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        checkFavoriteStatus();

        // Fade-in
        currentPhoto.onload = () => {
            currentPhoto.classList.remove('fade-out');
            photoCaption.style.opacity = 1;
            photoCaption.style.transition = 'opacity 1s ease';
        };
    }, 300);
}

function changePhoto(direction) {
    currentIndex = (currentIndex + direction + albumData.length) % albumData.length;
    flipCard.classList.remove('flipped'); // Resetar carta
    loadPhoto(currentIndex);
}

// ... (renderThumbnails mantido igual, mas omitido aqui para brevidade se não mudou) ... 
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


// --- LÓGICA DA CARTA ---
function openLetter() {
    letterModal.classList.remove('hidden');
    // Pequeno delay para animação de entrada se houver
}

function closeLetter() {
    letterModal.classList.add('hidden');
    flipCard.classList.remove('flipped');
}

// --- CHUVA DE CORAÇÕES ---
function handleFavoriteClick() {
    toggleFavorite();

    // Se acabou de favoritar (agora está active), iniciar chuva
    if (btnFavorite.classList.contains('active')) {
        createHeartRain();
    }
}

function createHeartRain() {
    const container = document.getElementById('heart-rain-container');
    const duration = 10000; // 10 segundos
    const endTime = Date.now() + duration;

    const interval = setInterval(() => {
        if (Date.now() > endTime) {
            clearInterval(interval);
            return;
        }

        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 3 a 5 segundos de queda
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';

        container.appendChild(heart);

        // Remover elemento após animação
        setTimeout(() => {
            heart.remove();
        }, 5000);

    }, 300); // Criar um coração a cada 300ms
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
        btnFavorite.querySelector('i').className = 'fas fa-heart'; // Coração preenchido
    } else {
        btnFavorite.classList.remove('active');
        btnFavorite.querySelector('i').className = 'far fa-heart'; // Coração vazio
    }
}

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
    link.target = '_blank'; // Para suporte melhor a links externos
    link.click();
}

// --- TOUCH SWIPE (MOBILE) ---
function setupSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;

    const viewer = document.querySelector('.main-viewer');

    viewer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    viewer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        if (touchEndX < touchStartX - 50) {
            changePhoto(1); // Swipe Left -> Next
        }
        if (touchEndX > touchStartX + 50) {
            changePhoto(-1); // Swipe Right -> Prev
        }
    }
}

// Iniciar
init();
