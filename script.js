// デバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// スロットル関数
function throttle(func, wait) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
}

// 安全なDOM要素取得関数
function safeQuerySelector(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Error finding element with selector: ${selector}`, error);
    return null;
  }
}

// 安全なDOM要素取得関数（複数）
function safeQuerySelectorAll(selector, parent = document) {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Error finding elements with selector: ${selector}`, error);
    return [];
  }
}

// 最適化されたスクロール処理
const optimizedScrollHandler = throttle(() => {
  try {
    const header = safeQuerySelector(".header");
    if (header) {
      if (window.scrollY > 50) {
        header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      } else {
        header.style.backgroundColor = "#fff";
        header.style.boxShadow = "none";
      }
    }
  } catch (error) {
    console.warn("Error in scroll handler:", error);
  }
}, 16); // ~60fps

window.addEventListener("scroll", optimizedScrollHandler, { passive: true });

// スムーズスクロール
try {
  const anchors = safeQuerySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = window.innerWidth <= 768 ? 60 : 80; // モバイルでは60px、デスクトップでは80px
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
} catch (error) {
  console.warn("Error setting up smooth scroll:", error);
}

document.addEventListener("DOMContentLoaded", function () {
  try {
    // 改善された画像の遅延読み込み
    const lazyImages = safeQuerySelectorAll("img[data-src]");
    if (lazyImages.length > 0) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              // WebP対応チェック
              const canvas = document.createElement("canvas");
              const webpSupported =
                canvas.toDataURL("image/webp").indexOf("webp") > -1;

              if (webpSupported && img.dataset.webp) {
                img.src = img.dataset.webp;
              } else {
                img.src = img.dataset.src;
              }

              img.classList.add("loaded");
              img.removeAttribute("data-src");
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px",
          threshold: 0.01,
        },
      );
      lazyImages.forEach((img) => imageObserver.observe(img));
    }

    // 動画の遅延読み込み
    const lazyVideos = safeQuerySelectorAll("video source[data-src]");
    if (lazyVideos.length > 0) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const video = entry.target.closest("video");
              const source = video?.querySelector("source[data-src]");
              if (source) {
                source.src = source.dataset.src;
                source.removeAttribute("data-src");
                video.load();
                videoObserver.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: "100px",
          threshold: 0.01,
        },
      );

      lazyVideos.forEach((source) => {
        const video = source.closest("video");
        if (video) videoObserver.observe(video);
      });
    }

    // ギャラリーモーダル機能
    const imageModal = safeQuerySelector("#imageModal");
    const modalImg = safeQuerySelector("#modalImage");
    const captionText = safeQuerySelector("#caption");
    const imageModalCloseBtn = safeQuerySelector("#imageModal .close");

    // ギャラリーアイテムのクリックイベント
    const galleryItems = safeQuerySelectorAll(".gallery-item");
    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        if (!imageModal) return;
        
        imageModal.style.display = "block";

        if (this.classList.contains("video-item")) {
          const videoSrc = this.getAttribute("data-video");
          if (modalImg) modalImg.style.display = "none";
          
          const existingVideo = imageModal.querySelector("video");
          if (existingVideo) {
            existingVideo.remove();
          }
          
          const video = document.createElement("video");
          video.src = videoSrc;
          video.controls = true;
          video.autoplay = true;
          video.style.width = "100%";
          video.style.maxHeight = "80vh";
          
          if (modalImg) {
            modalImg.parentNode.insertBefore(video, modalImg);
          }
          
          if (captionText) {
            captionText.innerHTML = this.getAttribute("data-caption") || "";
          }
          
          video.addEventListener("ended", function () {
            closeImageModal();
          });
        } else {
          if (modalImg) {
            modalImg.style.display = "block";
            modalImg.src = this.getAttribute("data-img") || "";
          }
          if (captionText) {
            captionText.innerHTML = this.getAttribute("data-caption") || "";
          }
        }
      });
    });

    // ギャラリーモーダルを閉じる関数
    function closeImageModal() {
      if (!imageModal) return;
      
      imageModal.style.display = "none";
      const video = imageModal.querySelector("video");
      if (video) {
        video.pause();
        video.remove();
      }
      if (captionText) {
        captionText.innerHTML = "";
      }
    }

    if (imageModalCloseBtn) {
      imageModalCloseBtn.onclick = closeImageModal;
    }

    window.addEventListener("click", function (event) {
      if (event.target == imageModal) {
        closeImageModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && imageModal && imageModal.style.display === "block") {
        closeImageModal();
      }
    });

    // 動画プレビューセクションのクリックイベント (index.html用)
    const videoPreviewImage = safeQuerySelector(".video-preview-image");
    if (videoPreviewImage) {
      videoPreviewImage.addEventListener("click", function () {
        window.location.href = "mv.html";
      });
    }

    // 最適化されたアニメーション
    const elementsToAnimate = safeQuerySelectorAll(
      ".spot-card, .gallery-item, .about-content, .access-content, .content-section",
    );

    if (elementsToAnimate.length > 0) {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
              animationObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.1,
        },
      );

      elementsToAnimate.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        animationObserver.observe(element);
      });
    }

    // ハンバーガーメニューの制御
    const hamburger = safeQuerySelector(".hamburger");
    const navContainer = safeQuerySelector(".nav-container");
    const navLinks = safeQuerySelectorAll(".nav-links a");

    // ハンバーガーメニューのトグル
    if (hamburger) {
      hamburger.addEventListener("click", function () {
        this.classList.toggle("is-active");
        if (navContainer) {
          navContainer.classList.toggle("is-active");
        }
      });
    }

    // サブメニューの制御（＋ボタンクリック）
    const submenuToggles = safeQuerySelectorAll(".submenu-toggle");
    submenuToggles.forEach((toggle) => {
      // クリックイベント
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSubmenu(this);
      });
      
      // タッチイベント（モバイル用）
      toggle.addEventListener("touchstart", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSubmenu(this);
      });
    });

    // サブメニューのトグル関数
    function toggleSubmenu(toggle) {
      const navItem = toggle.closest(".nav-item-with-submenu");
      if (!navItem) return;
      
      const submenu = navItem.querySelector(".submenu");
      if (!submenu) return;
      
      // 他のサブメニューを閉じる
      const allSubmenus = safeQuerySelectorAll(".submenu");
      allSubmenus.forEach((menu) => {
        if (menu !== submenu) {
          menu.classList.remove("is-active");
        }
      });
      
      const allToggles = safeQuerySelectorAll(".submenu-toggle");
      allToggles.forEach((btn) => {
        if (btn !== toggle) {
          btn.classList.remove("is-active");
        }
      });
      
      // 現在のサブメニューをトグル
      submenu.classList.toggle("is-active");
      toggle.classList.toggle("is-active");
    }

    // サブメニュー内のリンクをクリックしたときの処理
    const submenuLinks = safeQuerySelectorAll(".submenu a");
    submenuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        // モバイルではハンバーガーメニューを閉じる
        if (window.innerWidth <= 768) {
          if (hamburger && navContainer) {
            hamburger.classList.remove("is-active");
            navContainer.classList.remove("is-active");
          }
          // サブメニューも閉じる
          const navItem = this.closest(".nav-item-with-submenu");
          if (navItem) {
            const submenu = navItem.querySelector(".submenu");
            const toggle = navItem.querySelector(".submenu-toggle");
            if (submenu && toggle) {
              submenu.classList.remove("is-active");
              toggle.classList.remove("is-active");
            }
          }
        }
      });
    });

    // サブメニュー外をクリックしたときに閉じる
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".nav-item-with-submenu")) {
        const allSubmenus = safeQuerySelectorAll(".submenu");
        allSubmenus.forEach((submenu) => {
          submenu.classList.remove("is-active");
        });
        
        const allToggles = safeQuerySelectorAll(".submenu-toggle");
        allToggles.forEach((toggle) => {
          toggle.classList.remove("is-active");
        });
      }
    });

    // メニューリンクをクリックしたときにメニューを閉じる
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (hamburger && navContainer) {
          hamburger.classList.remove("is-active");
          navContainer.classList.remove("is-active");
        }
      });
    });

    // 画面外クリックでメニューを閉じる
    document.addEventListener("click", function (event) {
      if (hamburger && navContainer &&
          !hamburger.contains(event.target) &&
          !navContainer.contains(event.target)) {
        hamburger.classList.remove("is-active");
        navContainer.classList.remove("is-active");
      }
    });

    // インラインonclickの代替処理
    const scrollTargetElements = safeQuerySelectorAll("[data-scroll-target]");
    scrollTargetElements.forEach((element) => {
      element.addEventListener("click", function () {
        const targetId = this.getAttribute("data-scroll-target");
        if (targetId) {
          scrollToSection(targetId);
        }
      });
    });
    
  } catch (error) {
    console.error("Error in DOMContentLoaded:", error);
  }
}); // DOMContentLoaded 終了

// セクションへのスムーズスクロール (グローバル関数)
function scrollToSection(sectionId) {
  try {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = window.innerWidth <= 768 ? 60 : 80; // モバイルでは60px、デスクトップでは80px
      const targetPosition = section.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  } catch (error) {
    console.warn("Error scrolling to section:", error);
  }
}
