import Link from "next/link";
import Schools from "@/components/Schools";
import Works from "@/components/Works";
import React, { useEffect } from "react";
import { animateImages } from "@/shared/animation";

const Home: React.FC = () => {
  useEffect(() => {
    animateImages();
  }, []);

  return (
    <div>
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

      <main>
        <Schools />
        <h2>Skills</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus id
          aspernatur doloremque! Natus iure ea aliquam laborum nemo! Accusamus
          officiis aspernatur optio asperiores modi excepturi, dicta id
          necessitatibus nam perferendis!
        </p>
        <h2>Experience</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus id
          aspernatur doloremque! Natus iure ea aliquam laborum nemo! Accusamus
          officiis aspernatur optio asperiores modi excepturi, dicta id
          necessitatibus nam perferendis!
        </p>
        <h2>Get In Touch</h2>
        <Works />

        <Link href="/edit">
          <>Login</>
        </Link>
      </main>
    </div>
  );
};

export default Home;
