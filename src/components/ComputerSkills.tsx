import React from "react";

import { Transition } from "@headlessui/react";
import { InView } from "react-intersection-observer";

const ComputerSkills = () => {
  const data = [
    { id: 1, name: "Javascript", occupation: "Database management" },
    { id: 2, name: "HTML", occupation: "Database management" },
    { id: 3, name: "CSS", occupation: "Database management" },
    { id: 4, name: "REACT", occupation: "Database management" },
    { id: 5, name: "VUE", occupation: "Database management" },
    { id: 6, name: "NODE", occupation: "Database management" },
  ];

  return (
    <div>
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
                      className="block w-[200px] h-[400px] p-6 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      style={{
                        backgroundColor: "rgb(64, 64, 64)",
                        border: "1px solid rgb(130, 130, 130)",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <h3>Skills</h3>
                      <Transition.Child
                        as="h3"
                        enter="ease-in delay-[200ms] duration-[800ms] transition-all"
                        enterFrom="opacity-0 translate-y-12"
                        enterTo="opacity-100 translate-y-0"
                        className="text-3xl font-bold"
                      >
                        {item.name}
                      </Transition.Child>
                      <Transition.Child
                        as="div" // Change <p> to <div> here
                        className="text-gray-300"
                        enter="ease-in delay-[800ms] duration-[600ms] transition-all"
                        enterFrom="opacity-0 translate-y-12"
                        enterTo="opacity-100 translate-y-0"
                      >
                        <p> {item.occupation}</p>
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

export default ComputerSkills;
