// ========== КАРУСЕЛЬ ДЛЯ СЕРТИФИКАТОВ ==========
const certTrack = document.getElementById('certificatesTrack');
const certLeftBtn = document.getElementById('certLeftBtn');
const certRightBtn = document.getElementById('certRightBtn');

if (certTrack && certLeftBtn && certRightBtn) {
    certRightBtn.addEventListener('click', () => {
        certTrack.scrollBy({ left: 320, behavior: 'smooth' });
    });
    certLeftBtn.addEventListener('click', () => {
        certTrack.scrollBy({ left: -320, behavior: 'smooth' });
    });
}

// ========== КАРУСЕЛЬ ДЛЯ ПРОЕКТОВ ==========
const projectTrack = document.getElementById('projectsTrack');
const projectLeftBtn = document.getElementById('projectLeftBtn');
const projectRightBtn = document.getElementById('projectRightBtn');

if (projectTrack && projectLeftBtn && projectRightBtn) {
    projectRightBtn.addEventListener('click', () => {
        projectTrack.scrollBy({ left: 380, behavior: 'smooth' });
    });
    projectLeftBtn.addEventListener('click', () => {
        projectTrack.scrollBy({ left: -380, behavior: 'smooth' });
    });
}

// ========== ЗАПОЛНЕНИЕ КАРТОЧЕК ПРОЕКТОВ ИЗ JSON ==========
function fillProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const dataAttr = card.getAttribute('data-project');
        if (dataAttr) {
            try {
                const data = JSON.parse(dataAttr);
                card.innerHTML = `
                    <img src="${data.image || 'media/projects/default.jpg'}" alt="${data.title}">
                    <div class="project-info">
                        <h3>${data.title}</h3>
                        <p>${data.desc.substring(0, 100)}${data.desc.length > 100 ? '...' : ''}</p>
                        <div class="project-tech">${data.tech}</div>
                    </div>
                `;
                card.dataset.fullData = dataAttr;
            } catch(e) {
                console.error('Ошибка парсинга JSON:', e);
            }
        }
    });
}

// ========== МОДАЛЬНОЕ ОКНО ДЛЯ СЕРТИФИКАТОВ ==========
const certModal = document.getElementById('certModal');
const modalImage = document.getElementById('modalImage');
const closeBtns = document.querySelectorAll('.close');

// Открытие модального окна при клике на сертификат
document.querySelectorAll('.certificate-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const imgSrc = this.querySelector('img').src;
        modalImage.src = imgSrc;
        certModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ПРОЕКТОВ ==========
// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ПРОЕКТОВ ==========
const projectModal = document.getElementById('projectModal');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalFullDesc = document.getElementById('projectModalFullDesc');
const projectModalFeatures = document.getElementById('projectModalFeatures');
const projectModalTech = document.getElementById('projectModalTech');
const projectModalButtons = document.getElementById('projectModalButtons');
const projectModalLink = document.getElementById('projectModalLink');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const dataAttr = this.dataset.fullData;
        if (dataAttr) {
            try {
                const data = JSON.parse(dataAttr);
                
                // Медиа контейнер - ТОЛЬКО ФОТО (ШАПКА)
                const mediaContainer = document.getElementById('projectMediaContainer');
                mediaContainer.innerHTML = '';
                
                // Только картинка-шапка, без видео
                if (data.image) {
                    mediaContainer.innerHTML = `
                        <img src="${data.image}" alt="${data.title}" style="width: 100%; border-radius: 12px; margin-bottom: 20px;">
                    `;
                }
                
                // Заголовок
                projectModalTitle.textContent = data.title;
                
                // Полное описание
                projectModalFullDesc.innerHTML = `<p style="margin-bottom: 15px; line-height: 1.6;">${data.desc}</p>`;
                
                // Features (буллет-поинты) - идут после описания
                if (data.features && data.features.length > 0) {
                    let featuresHtml = `<h4 style="margin: 10px 0 10px 0; color: #475285;">Ключевые особенности:</h4><ul style="margin-left: 20px; margin-bottom: 20px;">`;
                    data.features.forEach(f => {
                        featuresHtml += `<li style="margin-bottom: 8px;">${f}</li>`;
                    });
                    featuresHtml += `</ul>`;
                    projectModalFeatures.innerHTML = featuresHtml;
                } else {
                    projectModalFeatures.innerHTML = '';
                }
                
                // ВИДЕО - идут после features (в самом конце)
                let videosHtml = '';
                if (data.videos && data.videos.length > 0) {
                    videosHtml = `<div style="margin-top: 20px; margin-bottom: 20px;">`;
                    data.videos.forEach((videoSrc, index) => {
                        videosHtml += `
                            <div style="margin-bottom: 20px;">
                                <p style="margin-bottom: 8px; font-size: 14px; color: #475285; font-weight: 500;">📹 Демонстрация ${index + 1}</p>
                                <video controls style="width: 100%; border-radius: 12px;">
                                    <source src="${videoSrc}" type="video/mp4">
                                    Ваш браузер не поддерживает видео
                                </video>
                            </div>
                        `;
                    });
                    videosHtml += `</div>`;
                } else if (data.video) {
                    videosHtml = `
                        <div style="margin-top: 20px; margin-bottom: 20px;">
                            <p style="margin-bottom: 8px; font-size: 14px; color: #475285; font-weight: 500;">📹 Демонстрация</p>
                            <video controls style="width: 100%; border-radius: 12px;">
                                <source src="${data.video}" type="video/mp4">
                                Ваш браузер не поддерживает видео
                            </video>
                        </div>
                    `;
                }
                
                // Создаём или находим контейнер для видео
                let videoContainer = document.getElementById('projectVideoContainer');
                if (!videoContainer) {
                    videoContainer = document.createElement('div');
                    videoContainer.id = 'projectVideoContainer';
                    // Вставляем после features
                    projectModalFeatures.insertAdjacentElement('afterend', videoContainer);
                }
                videoContainer.innerHTML = videosHtml;
                
                // Технологии
                projectModalTech.textContent = data.tech;
                
                // Кнопки (прототип и GitHub)
                projectModalButtons.innerHTML = '';
                if (data.prototype && data.prototype !== '#') {
                    projectModalButtons.innerHTML += `<a href="${data.prototype}" class="project-link prototype-link" target="_blank" style="background: #2a7f6e;">🔗 Смотреть прототип</a>`;
                }
                if (data.github && data.github !== '#') {
                    projectModalButtons.innerHTML += `<a href="${data.github}" class="project-link github-link" target="_blank" style="background: #24292e;">💻 GitHub</a>`;
                }
                
                projectModalLink.href = data.link || '#';
                projectModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } catch(e) {
                console.error('Ошибка:', e);
            }
        }
    });
});
// ========== ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН ==========
closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        certModal.style.display = 'none';
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Закрытие по клику вне модального окна
window.addEventListener('click', function(e) {
    if (e.target === certModal) {
        certModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Заполняем карточки проектов при загрузке
document.addEventListener('DOMContentLoaded', () => {
    fillProjectCards();
    
    // Добавляем стили для динамически созданных элементов
    const style = document.createElement('style');
    style.textContent = `
        .project-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }
        .project-card h3 {
            font-size: 18px;
            margin-bottom: 12px;
            color: #475285;
        }
        .project-card p {
            font-size: 14px;
            color: #555;
            line-height: 1.4;
            margin-bottom: 15px;
        }
        .project-tech {
            font-size: 12px;
            color: #888;
            background: rgba(0,0,0,0.05);
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
        }
    `;
    document.head.appendChild(style);
});