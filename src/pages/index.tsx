import Link from "next/link";
import Schools from "@/components/Schools";
import Works from "@/components/Works";
import React, { useEffect } from "react";
import { animateImages } from "@/shared/animation";
import Navbar from "@/components/Navbar";
import ComputerSkills from "@/components/ComputerSkills";
import { Transition } from "@headlessui/react";
import { InView } from "react-intersection-observer";

const Home: React.FC = () => {
  useEffect(() => {
    animateImages();
  }, []);

  return (
    <div>
      <Navbar />
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
        </div>
      </section>

      <main>
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
                    className="block w-[1250px] h-[590px] p-6 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    style={{
                      backgroundColor: "rgb(64, 64, 64)",
                      border: "1px solid rgb(130, 130, 130)",
                      textAlign: "center",
                    }}
                  >
                    <Transition.Child
                      as="h3"
                      enter="ease-in delay-[200ms] duration-[800ms] transition-all"
                      enterFrom="opacity-0 translate-y-12"
                      enterTo="opacity-100 translate-y-0"
                      className="text-3xl font-bold"
                    >
                      About me
                    </Transition.Child>
                    <Transition.Child
                      as="p"
                      className="text-3xl white"
                      enter="ease-in delay-[800ms] duration-[600ms] transition-all"
                      enterFrom="opacity-0 translate-y-12"
                      enterTo="opacity-100 translate-y-0"
                    >
                      Jeg er en lidenskapelig og entusiastisk nyutdannet
                      Frontend-utvikler som brenner for ny teknologi. Jeg har en
                      sterk interesse for å skape brukerorienterte løsninger for
                      web- og mobile enheter, og har lært meg å lage responsive
                      nettsider, grunnleggende designprinsipper, universell
                      utforming og tekniske løsninger og liker å jobbe med
                      objekt orientert programmering. Jeg har jobbet mange år
                      administrativt innen finans og regnskap/backoffice, samt
                      vært leder i dagligvarebransjen. Jeg har hatt varierte
                      oppgaver og fått grundig erfaring med rådgivning og
                      regnskap. De siste 12 årene har jeg vært administrativ
                      støtte i selskapene, hvor jeg har organisert drift,
                      innkjøp, rådgivning og markedsføring. Jeg er vant til å
                      jobbe selvstendig og finne løsninger på ulike
                      utfordringer, noe jeg trives godt med. Jeg er fleksibel,
                      raus og har god arbeidskapasitet. Jeg er positiv,
                      løsningsorientert, nysgjerrig og liker å lære. Jeg er
                      opptatt av å bidra til et godt arbeidsmiljø, og jeg trives
                      med å jobbe selvstendig og i smidige team hvor vi kan dele
                      kunnskap og erfaringer for å oppnå felles mål.
                    </Transition.Child>
                  </Transition.Child>
                </Transition.Root>
              </div>
            )}
          </InView>
        </div>
        <div className="Container">
          <Schools />
        </div>
        <div className="Container">
          <Works />
        </div>
        <div className="Container">
          <ComputerSkills />
        </div>

        <Link href="/edit">
          <button>Login</button>
        </Link>
      </main>
    </div>
  );
};

export default Home;
