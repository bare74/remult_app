import React from "react";
import Link from "next/link";
import Schools from "@/components/Schools";

const Home: React.FC = () => {
  return (
    <div>
      <h1>WELCOME</h1>
      <Link href="/edit">
        <>Login</>
      </Link>
      <div>
        <Schools />
      </div>
    </div>
  );
};

export default Home;
