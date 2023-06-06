import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animateImages = () => {
  gsap.utils
    .toArray("section")
    .forEach((section: HTMLElement | unknown, index: number) => {
      if (section instanceof HTMLElement) {
        const w = section.querySelector(".images");
        const [x, xEnd] = [w?.scrollWidth ? w.scrollWidth * -1 : 0, 0];
        gsap.fromTo(
          w,
          { x },
          {
            x: xEnd,
            scrollTrigger: {
              trigger: section,
              scrub: 1,
            },
          }
        );
      }
    });
};
