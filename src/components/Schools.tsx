// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const Schools: React.FC = () => {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://lmquxjoccrmkpaddrjez.supabase.co/rest/v1/schools",
//           {
//             headers: {
//               apikey: process.env.API_KEY, // Replace with your .env variable name
//             },
//           }
//         );
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Schools</h1>
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>
//             <p>Name: {item.name}</p>
//             <p>Occupation: {item.occupation}</p>
//             <p>From Date: {item.fromdate}</p>
//             <p>To Date: {item.todate}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Schools;
// component/Schools.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { School } from "../shared/School";

interface SchoolData extends Omit<School, "id"> {
  id: string;
}

const Schools: React.FC = () => {
  const [data, setData] = useState<SchoolData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<SchoolData[]>(
          "https://lmquxjoccrmkpaddrjez.supabase.co/rest/v1/schools",
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
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Occupation: {item.occupation}</p>
            <p>From: {item.fromDate}</p>
            <p>To: {item.toDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schools;