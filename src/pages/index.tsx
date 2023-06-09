import Link from "next/link";
import Schools from "@/components/Schools";
import Works from "@/components/Works";
import React, { useEffect } from "react";
import { animateImages } from "@/shared/animation";
import Navbar from "@/components/Navbar";

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
        <div className="Container">
          <Schools />
        </div>
        <div className="Container">
          <Works />
        </div>

        <Link href="/edit">
          <>Login</>
        </Link>
      </main>
    </div>
  );
};

export default Home;
