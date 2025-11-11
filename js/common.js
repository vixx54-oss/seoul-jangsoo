/* ------------------------------슬라이드 구현 */
// common.js - lineup 슬라이드 기능

document.addEventListener("DOMContentLoaded", function () {
  // Swiper 초기화 (히어로 섹션)
  const heroSwiper = new Swiper(".hero .swiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 3000, // 4초마다 자동 넘김
      disableOnInteraction: false, // 사용자 상호작용 후에도 자동재생 유지
    },
    speed: 800, // 전환 속도 (밀리초)
    effect: "slide", // 슬라이드 효과
    on: {
      init: function () {
        console.log("Hero Swiper initialized");
        // 초기 활성 슬라이드 설정
        const activeSlide = document.querySelector(".swiper-slide-active");
        if (activeSlide) {
          activeSlide.classList.add("progress-active");
        }
      },
      slideChangeTransitionEnd: function () {
        console.log("Slide changed");
        // CSS 클래스로 프로그레스 바 제어
        const allSlides = document.querySelectorAll(".swiper-slide");
        allSlides.forEach((slide) => {
          slide.classList.remove("progress-active");
        });

        const activeSlide = document.querySelector(".swiper-slide-active");
        if (activeSlide) {
          activeSlide.classList.add("progress-active");
        }
      },
    },
  });

  // Lineup 슬라이드 기능
  let currentIndex = 0;
  let isAnimating = false; // 애니메이션 중복 방지
  const totalSlides = 8;
  const lineupSlide = document.querySelector(".lineup-slide");
  const lineupList = document.querySelector(".lineup-list");
  const prevBtn = document.querySelector(".btns-prev");
  const nextBtn = document.querySelector(".btns-next");
  const pageDots = document.querySelectorAll(".page-dot");

  // 초기 상태 설정
  function initializeSlides() {
    const slides = lineupList.querySelectorAll("li");
    slides.forEach((slide, index) => {
      slide.style.transform = getSlideTransform(index, currentIndex);
      slide.style.opacity = getSlideOpacity(index, currentIndex);
      slide.style.zIndex = getSlideZIndex(index, currentIndex);
    });
  }

  // 슬라이드 변환 함수들 - 5개 카드 표시용
  function getSlideTransform(slideIndex, activeIndex) {
    const position = getRelativePosition(slideIndex, activeIndex);

    switch (position) {
      case 0: // 중앙 (활성)
        return "translate(-50%, -50%) translateZ(0px) scale(1.1)";
      case 1: // 오른쪽 첫번째
        return "translate(-50%, -50%) translateX(440px) translateZ(-100px) rotateY(25deg) scale(0.85)";
      case -1: // 왼쪽 첫번째
        return "translate(-50%, -50%) translateX(-440px) translateZ(-100px) rotateY(-25deg) scale(0.85)";
      case 2: // 오른쪽 두번째
        return "translate(-50%, -50%) translateX(720px) translateZ(-200px) rotateY(45deg) scale(0.65)";
      case -2: // 왼쪽 두번째
        return "translate(-50%, -50%) translateX(-720px) translateZ(-200px) rotateY(-45deg) scale(0.65)";
      default: // 숨김
        return "translate(-50%, -50%) translateZ(-400px) scale(0.5)";
    }
  }

  function getSlideOpacity(slideIndex, activeIndex) {
    const position = getRelativePosition(slideIndex, activeIndex);
    if (position === 0) return 1; // 중앙
    if (position === 1 || position === -1) return 0.8; // 좌우 첫번째
    if (position === 2 || position === -2) return 0.6; // 좌우 두번째
    return 0; // 숨김
  }

  function getSlideZIndex(slideIndex, activeIndex) {
    const position = getRelativePosition(slideIndex, activeIndex);
    if (position === 0) return 10; // 중앙
    if (position === 1 || position === -1) return 7; // 좌우 첫번째
    if (position === 2 || position === -2) return 4; // 좌우 두번째
    return 1; // 숨김
  }

  // 상대적 위치 계산 (원형 배열)
  function getRelativePosition(slideIndex, activeIndex) {
    let diff = slideIndex - activeIndex;

    // 원형 배열을 위한 조정
    if (diff > totalSlides / 2) {
      diff -= totalSlides;
    } else if (diff < -totalSlides / 2) {
      diff += totalSlides;
    }

    return diff;
  }

  // 페이지네이션 업데이트
  function updatePagination() {
    pageDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // 슬라이드 업데이트 (부드러운 애니메이션)
  function updateSlides() {
    const slides = lineupList.querySelectorAll("li");

    // 애니메이션 시작 전 준비
    lineupSlide.style.pointerEvents = "none";

    slides.forEach((slide, index) => {
      // 모든 슬라이드 동시에 부드럽게 전환
      slide.style.transform = getSlideTransform(index, currentIndex);
      slide.style.opacity = getSlideOpacity(index, currentIndex);
      slide.style.zIndex = getSlideZIndex(index, currentIndex);

      // 활성 클래스 업데이트
      slide.classList.toggle("active", index === currentIndex);
    });

    // 페이지네이션 업데이트
    updatePagination();

    // 애니메이션 완료 후 이벤트 다시 활성화
    setTimeout(() => {
      lineupSlide.style.pointerEvents = "auto";
    }, 800);
  }

  // 다음 슬라이드 (부드러운 전환)
  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlides();

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // 이전 슬라이드 (부드러운 전환)
  function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlides();

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // 특정 슬라이드로 이동
  function goToSlide(index) {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    currentIndex = index;
    updateSlides();

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // 이벤트 리스너
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // 페이지네이션 이벤트 리스너
  pageDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // 초기화
  initializeSlides();
  updatePagination();

  // 자동 재생
  setInterval(() => {
    nextSlide();
  }, 2200);

  // 키보드 네비게이션 (선택사항)
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });
});
