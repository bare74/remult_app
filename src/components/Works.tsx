import React, { useEffect, useState } from "react";
import axios from "axios";
import { Transition } from "@headlessui/react";
import { InView } from "react-intersection-observer";

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
      <div className="flex items-center justify-center">
        <InView>
          {({ inView, ref }) => (
            <ul ref={ref} className="flex flex-wrap justify-between">
              {data.map((item) => (
                <li key={item.id}>
                  <Transition.Root style={{ padding: "10px" }} show={inView}>
                    <Transition.Child
                      as="div"
                      enter="ease-in duration-[1000ms] transition-all"
                      enterFrom="opacity-0 translate-y-48"
                      enterTo="opacity-100 translate-y-0"
                      className="block w-[400px] h-[400px] p-6 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      style={{
                        backgroundColor: "rgb(64, 64, 64)",
                        border: "1px solid rgb(130, 130, 130)",
                      }}
                    >
                      <Transition.Child
                        as="h3"
                        enter="ease-in delay-[200ms] duration-[800ms] transition-all"
                        enterFrom="opacity-0 translate-y-12"
                        enterTo="opacity-100 translate-y-0"
                        className="text-3xl font-bold"
                      >
                        {item.workplace}
                      </Transition.Child>
                      <Transition.Child
                        as="div" // Change <p> to <div> here
                        className="text-gray-300"
                        enter="ease-in delay-[800ms] duration-[600ms] transition-all"
                        enterFrom="opacity-0 translate-y-12"
                        enterTo="opacity-100 translate-y-0"
                      >
                        <ul>
                          <li>{item.title}</li>
                          <li>{item.text}</li>
                          <li>
                            {formatDate(item.fromdate)} -{" "}
                            {formatDate(item.todate)}
                          </li>
                        </ul>
                      </Transition.Child>
                    </Transition.Child>
                  </Transition.Root>
                </li>
              ))}
            </ul>
          )}
        </InView>
      </div>
    </div>
  );
};

export default Works;
