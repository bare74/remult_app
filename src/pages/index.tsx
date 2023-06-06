import React from "react";
import Link from "next/link";
import Schools from "@/components/Schools";
import Works from "@/components/Works";

const Home: React.FC = () => {
  return (
    <div>
      <h1>WELCOME</h1>
      <Link href="/edit">
        <>Login</>
      </Link>
      <div>
        <Schools />
        <Works />
      </div>
    </div>
  );
};

export default Home;
