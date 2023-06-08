import React, { useEffect, useState } from "react";
import axios from "axios";

import { Work } from "../shared/Work";

const formatDate = (date?: string | Date) => {
  if (!date) {
    return "";
  }
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("no-NO");
};

const Works = () => {
  const [data, setData] = useState<Work[]>([]);

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
      <ul className="flex flex-wrap justify-between">
        {data.map((item) => (
          <li
            key={item.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-6 mb-4"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-full">
              <p>{item.workplace}</p>
              <p>{item.title}</p>
              <p>{item.text}</p>
              <p>{formatDate(item.fromdate)}</p>
              <p>{formatDate(item.todate)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Works;
