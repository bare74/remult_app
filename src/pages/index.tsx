import Link from "next/link";
import Schools from "@/components/Schools";
import Works from "@/components/Works";
import React, { useEffect } from "react";
import { animateImages } from "@/shared/animation";
import Navbar from "@/components/Navbar";
import { Transition } from "@headlessui/react";
import { InView } from "react-intersection-observer";

const Home: React.FC = () => {
  useEffect(() => {
    animateImages();
  }, []);

  return (
    <div>
      <Navbar />

      <main>
        <Link href="/edit">
          <>Login</>
        </Link>
      </main>
      <>
        <section className="banner">
          <header>
            <div>
              <h2>Bjørn Are Nielsen</h2>
              <h3>Frontend Developer</h3>
            </div>
            <img src="/assets/avatar.jpg" />
          </header>
          <div className="images">
            <img height="874" src="/assets/1.jpg" width="1240" />
            <img height="874" src="/assets/2.jpg" width="1240" />
            <img height="874" src="/assets/3.jpg" width="1240" />
            <img height="874" src="/assets/1.jpg" width="1240" />
          </div>
        </section>
        <div className="flex h-screen items-center justify-center">
          <InView>
            {({ inView, ref }) => (
              <div ref={ref}>
                <Transition.Root show={inView}>
                  <Transition.Child
                  // as="div"
                  // enter="ease-in duration-[1000ms] transition-all"
                  // enterFrom="opacity-0 translate-y-48"
                  // enterTo="opacity-100 translate-y-0"
                  // className="w-full max-w-lg space-y-4 rounded-xl bg-gray-500 p-24 text-white"
                  >
                    <Transition.Child>
                      <Schools />
                    </Transition.Child>
                    <Transition.Child>
                      <Works />
                    </Transition.Child>
                    <Transition.Child
                    //   as="p"
                    //   className="text-gray-300"
                    //   enter="ease-in delay-[800ms] duration-[600ms] transition-all"
                    //   enterFrom="opacity-0 translate-y-12"
                    //   enterTo="opacity-100 translate-y-0"
                    >
                      Here is the scroll effect.
                    </Transition.Child>
                  </Transition.Child>
                </Transition.Root>
              </div>
            )}
          </InView>
        </div>
      </>

      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-lg space-y-4 rounded-xl bg-gray-500 p-24 text-white">
          <h3 className="text-3xl font-bold">Scroll Animate Demo</h3>
          <p className="text-gray-300">
            Please scroll down to the next page to see the fade-in effect.
          </p>
        </div>
      </div>
      <div className="flex h-screen items-center justify-center">
        <InView>
          {({ inView, ref }) => (
            <div ref={ref}>
              <Transition.Root show={inView}>
                <Transition.Child
                  as="div"
                  enter="ease-in duration-[1000ms] transition-all"
                  enterFrom="opacity-0 translate-y-48"
                  enterTo="opacity-100 translate-y-0"
                  className="w-full max-w-lg space-y-4 rounded-xl bg-gray-500 p-24 text-white"
                >
                  <Transition.Child
                    as="h3"
                    enter="ease-in delay-[200ms] duration-[800ms] transition-all"
                    enterFrom="opacity-0 translate-y-12"
                    enterTo="opacity-100 translate-y-0"
                    className="text-3xl font-bold"
                  >
                    Second page
                  </Transition.Child>
                  <Transition.Child
                    as="p"
                    className="text-gray-300"
                    enter="ease-in delay-[800ms] duration-[600ms] transition-all"
                    enterFrom="opacity-0 translate-y-12"
                    enterTo="opacity-100 translate-y-0"
                  >
                    Here is the scroll effect.
                  </Transition.Child>
                </Transition.Child>
              </Transition.Root>
            </div>
          )}
        </InView>
      </div>
    </div>
  );
};

export default Home;
