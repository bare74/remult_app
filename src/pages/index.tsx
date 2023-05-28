// import { useEffect, useState, FormEvent } from "react";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { remult, UserInfo } from "remult";
// import { School } from "../shared/School";
// import { Work } from "../shared/Work";
// import ably from "ably/promises";
// import { AblySubscriptionClient } from "remult/ably";

// const schoolRepo = remult.repo(School);
// const workRepo = remult.repo(Work);

// export default function Home() {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [newSchoolName, setNewSchoolName] = useState("");
//   const [newSchoolOccupation, setNewSchoolOccupation] = useState("");
//   const [newSchoolFromDate, setNewSchoolFromDate] = useState("");
//   const [newSchoolToDate, setNewSchoolToDate] = useState("");
//   const [works, setWorks] = useState<Work[]>([]);
//   const [newWorkTitle, setNewWorkTitle] = useState("");
//   const [newWorkPlace, setNewWorkPlace] = useState("");
//   const [newWorkText, setNewWorkText] = useState("");
//   const [newWorkFromDate, setNewWorkFromDate] = useState("");
//   const [newWorkToDate, setNewWorkToDate] = useState("");
//   const [loading, setLoading] = useState(true); // Add loading state
//   const { data: session, status } = useSession();

//   const addSchool = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const newSchool = await schoolRepo.insert([
//         {
//           name: newSchoolName,
//           occupation: newSchoolOccupation,
//           fromDate: new Date(newSchoolFromDate),
//           toDate: new Date(newSchoolToDate),
//         },
//       ]);
//       setNewSchoolName("");
//       setNewSchoolOccupation("");
//       setNewSchoolFromDate("");
//       setNewSchoolToDate("");
//     } catch (error: any) {
//       alert(error.message);
//     }
//   };

//   const addWork = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const newWork = await workRepo.insert([
//         {
//           title: newWorkTitle,
//           workPlace: newWorkPlace,
//           text: newWorkText,
//           fromDate: new Date(newWorkFromDate),
//           toDate: new Date(newWorkToDate),
//         },
//       ]);
//       // Reset state variables
//       setNewWorkTitle("");
//       setNewWorkPlace("");
//       setNewWorkText("");
//       setNewWorkFromDate("");
//       setNewWorkToDate("");
//     } catch (error: any) {
//       alert(error.message);
//     }
//   };

//   useEffect(() => {
//     let schoolSubscription: any = null;
//     let workSubscription: any = null;

//     const fetchData = async () => {
//       try {
//         const authResponse = await fetch("/api/getAblyToken"); // Replace with your token generation endpoint
//         const tokenDetails = await authResponse.json();
//         const token = tokenDetails.token;

//         const ablyClient = new ably.Realtime({
//           authUrl: "/api/getAblyToken", // Replace with your token generation endpoint
//         });

//         remult.apiClient.subscriptionClient = new AblySubscriptionClient(
//           ablyClient
//         );
//         remult.user = session?.user as UserInfo;

//         if (status === "unauthenticated") signIn();
//         else if (status === "authenticated") {
//           schoolSubscription = schoolRepo
//             .liveQuery({
//               limit: 20,
//             })
//             .subscribe((info) => {
//               setSchools(info.applyChanges);
//               setLoading(false);
//             });

//           workSubscription = workRepo
//             .liveQuery({
//               limit: 20,
//             })
//             .subscribe((info) => {
//               setWorks(info.applyChanges);
//               setLoading(false);
//             });
//         }
//       } catch (error: any) {
//         console.error("Error fetching Ably token:", error);
//         alert("Error fetching Ably token. Please try again.");
//       }
//     };

//     fetchData();

//     return () => {
//       if (schoolSubscription && schoolSubscription.close) {
//         // Check if subscription exists and has close() method
//         schoolSubscription.close();
//       }
//       if (workSubscription && workSubscription.close) {
//         // Check if subscription exists and has close() method
//         workSubscription.close();
//       }
//     };
//   }, [session, status]);

//   if (status !== "authenticated") return <></>;

//   if (loading) {
//     return <div>Loading...</div>; // Display a loading message or spinner
//   }
//   return (
//     <div>
//       <div>
//         <h1>Schools</h1>
//         <main>
//           <div>
//             Hello {remult.user?.name}
//             <button onClick={() => signOut()}>Sign Out</button>
//           </div>

//           {schoolRepo.metadata.apiInsertAllowed() && (
//             <form onSubmit={addSchool}>
//               <input
//                 value={newSchoolName}
//                 placeholder="School Name"
//                 onChange={(e) => setNewSchoolName(e.target.value)}
//               />
//               <input
//                 value={newSchoolOccupation}
//                 placeholder="Occupation"
//                 onChange={(e) => setNewSchoolOccupation(e.target.value)}
//               />
//               <input
//                 type="date"
//                 value={newSchoolFromDate}
//                 onChange={(e) => setNewSchoolFromDate(e.target.value)}
//               />
//               <input
//                 type="date"
//                 value={newSchoolToDate}
//                 onChange={(e) => setNewSchoolToDate(e.target.value)}
//               />
//               <button>Add</button>
//             </form>
//           )}

//           {schools.map((school) => {
//             const setSchool = (value: School) =>
//               setSchools((prevSchools) =>
//                 prevSchools.map((s) => (s.id === school.id ? value : s))
//               );

//             const setName = (name: string) => setSchool({ ...school, name });
//             const setOccupation = (occupation: string) =>
//               setSchool({ ...school, occupation });
//             const setFromDate = (fromDate: string) =>
//               setSchool({ ...school, fromDate: new Date(fromDate) });

//             const setToDate = (toDate: string) =>
//               setSchool({ ...school, toDate: new Date(toDate) });

//             const saveSchool = async () => {
//               try {
//                 const { id, name, occupation, fromDate, toDate } = school;
//                 const updatedSchool = {
//                   id,
//                   name,
//                   occupation,
//                   fromDate,
//                   toDate,
//                   completed: true, // Add the completed property if it's appropriate for your use case
//                 };
//                 await schoolRepo.update(id, updatedSchool);
//               } catch (error: any) {
//                 console.log("Error saving school:", error.message);
//                 alert(error.message);
//               }
//             };

//             const deleteSchool = async () => {
//               try {
//                 await schoolRepo.delete(school);
//               } catch (error: any) {
//                 alert(error.message);
//               }
//             };

//             return (
//               <div key={school.id}>
//                 <input
//                   value={school.name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <input
//                   value={school.occupation}
//                   onChange={(e) => setOccupation(e.target.value)}
//                 />
//                 <input
//                   type="date"
//                   value={
//                     school.fromDate
//                       ? school.fromDate.toISOString().split("T")[0]
//                       : ""
//                   }
//                   onChange={(e) => setFromDate(e.target.value)}
//                 />
//                 <input
//                   type="date"
//                   value={
//                     school.toDate
//                       ? school.toDate.toISOString().split("T")[0]
//                       : ""
//                   }
//                   onChange={(e) => setToDate(e.target.value)}
//                 />
//                 <button onClick={saveSchool}>Save</button>
//                 {schoolRepo.metadata.apiDeleteAllowed(school) && (
//                   <button onClick={deleteSchool}>Delete</button>
//                 )}
//               </div>
//             );
//           })}
//         </main>
//       </div>
//       <div>
//         <h1>Works</h1>
//         <main>
//           {workRepo.metadata.apiInsertAllowed() && (
//             <form onSubmit={addWork}>
//               <input
//                 value={newWorkPlace}
//                 placeholder="Work"
//                 onChange={(e) => setNewWorkPlace(e.target.value)}
//               />
//               <input
//                 value={newWorkTitle}
//                 placeholder="Title"
//                 onChange={(e) => setNewWorkTitle(e.target.value)}
//               />
//               <input
//                 value={newWorkText}
//                 placeholder="Text"
//                 onChange={(e) => setNewWorkText(e.target.value)}
//               />
//               <input
//                 type="date"
//                 value={newWorkFromDate}
//                 onChange={(e) => setNewWorkFromDate(e.target.value)}
//               />
//               <input
//                 type="date"
//                 value={newWorkToDate}
//                 onChange={(e) => setNewWorkToDate(e.target.value)}
//               />
//               <button>Add</button>
//             </form>
//           )}

//           {works.map((work) => {
//             const setWork = (value: Work) =>
//               setWorks((prevWorks) =>
//                 prevWorks.map((w) => (w.id === work.id ? value : w))
//               );

//             const setTitle = (title: string) => setWork({ ...work, title });
//             const setWorkPlace = (workPlace: string) =>
//               setWork({ ...work, workPlace });
//             const setText = (text: string) => setWork({ ...work, text });
//             const setFromDate = (fromDate: string) =>
//               setWork({ ...work, fromDate: new Date(fromDate) });
//             const setToDate = (toDate: string) =>
//               setWork({ ...work, toDate: new Date(toDate) });

//             const saveWork = async () => {
//               try {
//                 const { id, title, workPlace, text, fromDate, toDate } = work;
//                 const updatedWork = {
//                   id,
//                   title,
//                   workPlace,
//                   text,
//                   fromDate,
//                   toDate,
//                   completed: true,
//                 };
//                 await workRepo.update(id, updatedWork);
//               } catch (error: any) {
//                 console.log("Error saving work:", error.message);
//                 alert(error.message);
//               }
//             };

//             const deleteWork = async () => {
//               try {
//                 await workRepo.delete(work);
//               } catch (error: any) {
//                 alert(error.message);
//               }
//             };

//             return (
//               <div key={work.id}>
//                 <input
//                   value={work.title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//                 <input
//                   value={work.workPlace}
//                   onChange={(e) => setWorkPlace(e.target.value)}
//                 />
//                 <input
//                   value={work.text}
//                   onChange={(e) => setText(e.target.value)}
//                 />
//                 <input
//                   type="date"
//                   value={
//                     work.fromDate
//                       ? work.fromDate.toISOString().split("T")[0]
//                       : ""
//                   }
//                   onChange={(e) => setFromDate(e.target.value)}
//                 />
//                 <input
//                   type="date"
//                   value={
//                     work.toDate ? work.toDate.toISOString().split("T")[0] : ""
//                   }
//                   onChange={(e) => setToDate(e.target.value)}
//                 />
//                 <button onClick={saveWork}>Save</button>
//                 {workRepo.metadata.apiDeleteAllowed(work) && (
//                   <button onClick={deleteWork}>Delete</button>
//                 )}
//               </div>
//             );
//           })}
//         </main>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { remult, UserInfo } from "remult";
import { School } from "../shared/School";
import { Work } from "../shared/Work";
import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";
import SchoolSection from "../components/SchoolSection";
import WorkSection from "../components/WorkSection";

const schoolRepo = remult.repo(School);
const workRepo = remult.repo(Work);

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    let schoolSubscription: any = null;
    let workSubscription: any = null;

    const fetchData = async () => {
      try {
        const authResponse = await fetch("/api/getAblyToken"); // Replace with your token generation endpoint
        const tokenDetails = await authResponse.json();
        const token = tokenDetails.token;

        const ablyClient = new ably.Realtime({
          authUrl: "/api/getAblyToken", // Replace with your token generation endpoint
        });

        remult.apiClient.subscriptionClient = new AblySubscriptionClient(
          ablyClient
        );
        remult.user = session?.user as UserInfo;

        if (status === "unauthenticated") signIn();
        else if (status === "authenticated") {
          schoolSubscription = schoolRepo
            .liveQuery({
              limit: 20,
            })
            .subscribe((info) => {
              setSchools(info.applyChanges);
              setLoading(false);
            });

          workSubscription = workRepo
            .liveQuery({
              limit: 20,
            })
            .subscribe((info) => {
              setWorks(info.applyChanges);
              setLoading(false);
            });
        }
      } catch (error: any) {
        console.error("Error fetching Ably token:", error);
        alert("Error fetching Ably token. Please try again.");
      }
    };

    fetchData();

    return () => {
      if (schoolSubscription && schoolSubscription.close) {
        // Check if subscription exists and has close() method
        schoolSubscription.close();
      }
      if (workSubscription && workSubscription.close) {
        // Check if subscription exists and has close() method
        workSubscription.close();
      }
    };
  }, [session, status]);

  if (status !== "authenticated") return <></>;

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  return (
    <div>
      <div>
        <h1>Schools</h1>
        <main>
          <div>
            Hello {remult.user?.name}
            <button onClick={() => signOut()}>Sign Out</button>
          </div>

          <SchoolSection />
        </main>
      </div>
      <div>
        <h1>Works</h1>
        <main>
          <WorkSection />
        </main>
      </div>
    </div>
  );
}
function setSchools(applyChanges: (prevState: School[]) => School[]) {
  // Update the state of schools using the applyChanges function
  // For example, if applyChanges is a function that returns the updated array of schools, you can use:
  // setSchools(applyChanges);
}

function setWorks(applyChanges: (prevState: Work[]) => Work[]) {
  // Update the state of works using the applyChanges function
  // For example, if applyChanges is a function that returns the updated array of works, you can use:
  // setWorks(applyChanges);
}
