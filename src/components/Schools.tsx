import React, { useEffect, useState } from "react";
import axios from "axios";

import { School } from "../shared/School";

const formatDate = (date?: string | Date) => {
  if (!date) {
    return "";
  }
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("no-NO");
};

const Schools = () => {
  const [data, setData] = useState<School[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<School[]>(
          process.env.NEXT_PUBLIC_API_URL + "/schools",
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
      <h1>Schools</h1>
      <ul className="flex flex-wrap justify-between">
        {data.map((item) => (
          <li
            key={item.id}
            className="max-w-sm p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <p>{item.name}</p>
            <p>{item.occupation}</p>
            <p>{formatDate(item.fromdate)}</p>
            <p>{formatDate(item.todate)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schools;
