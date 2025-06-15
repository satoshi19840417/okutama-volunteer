// スクロール時のヘッダー制御
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.boxShadow = 'none';
    }
});

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 画像の遅延読み込み
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));

    // ギャラリーモーダル機能
    const imageModal = document.getElementById('imageModal'); // 変数名を明確化
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const imageModalCloseBtn = document.querySelector('#imageModal .close'); // 明示的にimageModal内の.closeを指定

    // ギャラリーアイテムのクリックイベント
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            imageModal.style.display = "block";
            
            if (this.classList.contains('video-item')) {
                const videoSrc = this.getAttribute('data-video');
                modalImg.style.display = 'none';
                const existingVideo = imageModal.querySelector('video');
                if (existingVideo) {
                    existingVideo.remove();
                }
                const video = document.createElement('video');
                video.src = videoSrc;
                video.controls = true;
                video.autoplay = true;
                video.style.width = '100%';
                video.style.maxHeight = '80vh';
                modalImg.parentNode.insertBefore(video, modalImg);
                captionText.innerHTML = this.getAttribute('data-caption');
                video.addEventListener('ended', function() {
                    closeImageModal();
                });
            } else {
                modalImg.style.display = 'block';
                modalImg.src = this.getAttribute('data-img');
                captionText.innerHTML = this.getAttribute('data-caption');
            }
        });
    });

    // ギャラリーモーダルを閉じる関数
    function closeImageModal() {
        imageModal.style.display = "none";
        const video = imageModal.querySelector('video');
        if (video) {
            video.pause();
            video.remove();
        }
        captionText.innerHTML = '';
    }

    if (imageModalCloseBtn) {
        imageModalCloseBtn.onclick = closeImageModal;
    }

    window.addEventListener('click', function(event) {
        if (event.target == imageModal) {
            closeImageModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && imageModal.style.display === 'block') {
            closeImageModal();
        }
    });

    // 動画プレビューセクションのクリックイベント (index.html用)
    const videoPreviewImage = document.querySelector('.video-preview-image');
    if (videoPreviewImage) {
        videoPreviewImage.addEventListener('click', function() {
            window.location.href = 'mv.html';
        });
    }

    // アニメーション
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.spot-card, .gallery-item, .about-content, .access-content, .content-section');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    const elementsToAnimate = document.querySelectorAll('.spot-card, .gallery-item, .about-content, .access-content, .content-section');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    });
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

}); // DOMContentLoaded 終了

// セクションへのスムーズスクロール (グローバル関数)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
} 