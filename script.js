/**
 * CONFIGURAÇÃO DO ÁLBUM
 * =====================
 * Adicione suas fotos aqui! Substitua os dados de exemplo pelos seus.
 * 
 * src: Caminho da imagem (ex: 'img/foto1.jpg' ou uma URL)
 * legenda: Texto romântico para a foto
 * data: Data do momento (opcional)
 * local: Local onde foi tirada (opcional)
 */
const albumData = [
    {
        src: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=1000&auto=format&fit=crop", // Exemplo: Pôr do sol
        legenda: "Onde tudo começou... cada pôr do sol me lembra você ❤️",
        data: "14/02/2023",
        local: "Praia dos Sonhos"
    },
    {
        src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop", // Exemplo: Casal
        legenda: "Seu sorriso ilumina até os meus dias mais cinzas ✨",
        data: "20/03/2023",
        local: "Nosso Parque"
    },
    {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop", // Exemplo: Coquetel/Jantar
        legenda: "Ainda sinto o gosto desse dia perfeito 🥂",
        data: "12/06/2023",
        local: "Jantar Romântico"
    },
    // ADICIONE MAIS FOTOS AQUI SEGUINDO A MESMA ESTRUTURA
    // { src: "...", legenda: "...", data: "...", local: "..." },
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
    
    // Event Listeners
    btnPrev.addEventListener('click', () => changePhoto(-1));
    btnNext.addEventListener('click', () => changePhoto(1));
    btnPlay.addEventListener('click', togglePlay);
    btnFavorite.addEventListener('click', toggleFavorite);
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnDownload.addEventListener('click', downloadPhoto);

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changePhoto(-1);
        if (e.key === 'ArrowRight') changePhoto(1);
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
        
        // Texto da legenda com efeito de digitação (simples)
        photoCaption.style.opacity = 0;
        photoCaption.textContent = photo.legenda;
        
        dateText.textContent = photo.data || '';
        locationText.textContent = photo.local || '';
        
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
        
        // Fade-in da nova imagem
        currentPhoto.onload = () => {
            currentPhoto.classList.remove('fade-out');
            photoCaption.style.opacity = 1;
            photoCaption.style.transition = 'opacity 1s ease';
        };
    }, 300); // Tempo do fade-out
}

function changePhoto(direction) {
    currentIndex = (currentIndex + direction + albumData.length) % albumData.length;
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
            // Pausar se clicar manualmente
            if (isPlaying) togglePlay(); 
        });
        
        thumbnailsList.appendChild(thumb);
    });
}

// --- FUNCIONALIDADES EXTRAS ---

function togglePlay() {
    isPlaying = !isPlaying;
    const icon = btnPlay.querySelector('i');
    
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        slideInterval = setInterval(() => changePhoto(1), 3000); // 3 segundos por foto
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        clearInterval(slideInterval);
    }
}

function toggleFavorite() {
    const photoUrl = albumData[currentIndex].src;
    const indexInFavs = favorites.indexOf(photoUrl);
    
    if (indexInFavs === -1) {
        favorites.push(photoUrl);
        btnFavorite.classList.add('active');
        // Opcional: Animação de coração flutuando
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
