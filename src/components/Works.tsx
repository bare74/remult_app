import React, { useEffect, useState } from "react";
import axios from "axios";

import { Work } from "../shared/Work";

const Works = () => {
  const [data, setData] = useState<Work[]>([]);

  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Work[]>(
          process.env.NEXT_PUBLIC_API_URL + "/works",
          {
            headers: {
              apikey: process.env.API_KEY,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Works</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <p>workplace: {item.workplace}</p>
            <p>Title: {item.title}</p>
            <p>Text: {item.text}</p>
            <p>From: {item.fromdate?.toString()}</p>
            <p>To: {item.todate?.toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Works;
