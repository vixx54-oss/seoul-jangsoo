// GSAP ScrollSmoother 초기화
document.addEventListener("DOMContentLoaded", () => {
  // GSAP 플러그인 등록
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // ScrollSmoother 생성
  let smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2, // 부드러움 정도 (0-3, 높을수록 더 부드러움)
    effects: true, // data-speed 속성 활성화
  });

  // 네비게이션 링크에 대한 부드러운 스크롤
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement && smoother) {
        // ScrollSmoother의 scrollTo 메서드 사용
        smoother.scrollTo(targetElement, true, "top top");
      }
    });
  });

  // 스크롤 트리거 애니메이션 (선택사항)
  gsap.utils
    .toArray(".jangsu, .lineup, .pride, .time, .info")
    .forEach((section, i) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
});
