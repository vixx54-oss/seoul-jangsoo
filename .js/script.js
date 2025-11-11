document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  ScrollSmoother.create({
    wrapper: "#smooth-wrapper", // 이거 필수!
    content: "#smooth-content", // 이것도 필수!
    smooth: 0.5,
    effects: true,
  });
});
