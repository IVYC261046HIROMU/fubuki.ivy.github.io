document.addEventListener("DOMContentLoaded", () => {
    console.log("FBKINGDOM STORY サイトのスクリプトが正常に読み込まれました。");

    // 今後ここに、スクロール時のアニメーションや
    // 画像のポップアップ機能などを追加していきます。
});
document.addEventListener("DOMContentLoaded", () => {
    console.log("FBKINGDOM STORY Web App Initialized.");

    // Scroll Back To Top Button visibility
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================
    // FBKINGDOM NEWS（スライダー/カルーセル制御機能）
    // =========================================================
    initUpcomingCarousel();
});

/**
 * FBKINGDOM NEWS：スライダー初期化＆制御関数
 */
function initUpcomingCarousel() {
    const track = document.getElementById("upcomingTrack");
    const prevBtn = document.getElementById("upcomingPrevBtn");
    const nextBtn = document.getElementById("upcomingNextBtn");
    const dotsContainer = document.getElementById("upcomingDots");

    if (!track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;

    // --- 1画面に表示する枚数の取得（PC:2枚 / スマホ:1枚） ---
 function getCardsPerView() {
    return window.innerWidth <= 900 ? 1 : 2;
}

    // --- 最大スライドインデックスの計算 ---
    function getMaxIndex() {
        const cardsPerView = getCardsPerView();
        return Math.max(0, slides.length - cardsPerView);
    }

    // --- ドットインジケーターの生成 ---
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        const maxIndex = getMaxIndex();

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("button");
            dot.classList.add("carousel-dot");
            if (i === currentIndex) dot.classList.add("active");
            dot.setAttribute("aria-label", `スライド ${i + 1}`);
            dot.addEventListener("click", () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // --- スライド移動処理 ---
    function goToSlide(index) {
        const maxIndex = getMaxIndex();
        // 範囲内にインデックスを制限
        currentIndex = Math.min(Math.max(index, 0), maxIndex);

        const cardsPerView = getCardsPerView();
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 20; // CSSで設定したgap値

        // 横移動距離の計算
        const moveAmount = (slideWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveAmount}px)`;

        // ボタンの有効/無効化更新
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;

        // ドットのactive状態更新
        if (dotsContainer) {
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentIndex);
            });
        }
    }

    // --- イベントリスナー設定 ---
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

    // 画面リサイズ時に表示枚数と位置を自動微調整
    window.addEventListener("resize", () => {
        createDots();
        goToSlide(currentIndex);
    });

    // スワイプ操作対応（スマホ用）
    let startX = 0;
    let isDragging = false;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // 50px以上スワイプしたらスライド移動
        if (diffX > 50) {
            goToSlide(currentIndex + 1);
        } else if (diffX < -50) {
            goToSlide(currentIndex - 1);
        }
        isDragging = false;
    }, { passive: true });

    // 初期化実行
    createDots();
    goToSlide(0);
}

/**
 * Opens modal dialog with details
 */
function openModal(date, title, desc, imgSrc) {
    const dateEl = document.getElementById("modalDate");
    const titleEl = document.getElementById("modalTitle");
    const descEl = document.getElementById("modalDesc");
    const imgEl = document.getElementById("modalImg");
    const overlay = document.getElementById("modalOverlay");

    if (dateEl) dateEl.innerText = date;
    if (titleEl) titleEl.innerText = title;
    if (descEl) descEl.innerText = desc;
    
    if (imgEl) {
        if (imgSrc && imgSrc.trim() !== '') {
            imgEl.src = imgSrc;
            imgEl.style.display = "block";
        } else {
            imgEl.style.display = "none";
        }
    }

    if (overlay) {
        overlay.classList.add("active");
    }
}

/**
 * Closes modal dialog
 */
function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    if (overlay) {
        overlay.classList.remove("active");
    }
}

/**
 * Closes modal when clicking outside modal box
 */
function closeModalOnOuterClick(event) {
    if (event.target.id === "modalOverlay") {
        closeModal();
    }
}

/**
 * Smoothly scrolls back to the top of the page
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}