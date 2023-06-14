import { signIn, signOut, useSession } from "next-auth/react";
import { remult, UserInfo } from "remult";
import { School } from "../shared/School";

import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";
import { FormEvent, useEffect, useState } from "react";

const schoolRepo = remult.repo(School);

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolOccupation, setNewSchoolOccupation] = useState("");
  const [newSchoolFromDate, setNewSchoolFromDate] = useState("");
  const [newSchoolToDate, setNewSchoolToDate] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const { data: session, status } = useSession();

  const addSchool = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newSchool = await schoolRepo.insert([
        {
          name: newSchoolName,
          occupation: newSchoolOccupation,
          fromdate: new Date(newSchoolFromDate),
          todate: new Date(newSchoolToDate),
        },
      ]);
      setNewSchoolName("");
      setNewSchoolOccupation("");
      setNewSchoolFromDate("");
      setNewSchoolToDate("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    let schoolSubscription: any = null;

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
    };
  }, [session, status]);

  if (status !== "authenticated") return <></>;

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }
  return (
    <div className="SchoolWork">
      <main>
        {schoolRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addSchool}>
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              value={newSchoolName}
              placeholder="School Name"
              onChange={(e) => setNewSchoolName(e.target.value)}
            />
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              value={newSchoolOccupation}
              placeholder="Occupation"
              onChange={(e) => setNewSchoolOccupation(e.target.value)}
            />
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              type="date"
              value={newSchoolFromDate}
              onChange={(e) => setNewSchoolFromDate(e.target.value)}
            />
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              type="date"
              value={newSchoolToDate}
              onChange={(e) => setNewSchoolToDate(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
              Add
            </button>
          </form>
        )}

        {schools.map((school) => {
          const setSchool = (value: School) =>
            setSchools((prevSchools) =>
              prevSchools.map((s) => (s.id === school.id ? value : s))
            );

          const setName = (name: string) => setSchool({ ...school, name });
          const setOccupation = (occupation: string) =>
            setSchool({ ...school, occupation });
          const setFromDate = (fromDate: string) =>
            setSchool({ ...school, fromdate: new Date(fromDate) });

          const setToDate = (toDate: string) =>
            setSchool({ ...school, todate: new Date(toDate) });

          const saveSchool = async () => {
            try {
              const { id, name, occupation, fromdate, todate } = school;
              const updatedSchool = {
                id,
                name,
                occupation,
                fromdate,
                todate,
                completed: true, // Add the completed property if it's appropriate for your use case
              };
              await schoolRepo.update(id, updatedSchool);
            } catch (error: any) {
              console.log("Error saving school:", error.message);
              alert(error.message);
            }
          };

          const deleteSchool = async () => {
            try {
              await schoolRepo.delete(school);
            } catch (error: any) {
              alert(error.message);
            }
          };

          return (
            <div key={school.id}>
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                value={school.name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                value={school.occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                type="date"
                value={
                  school.fromdate
                    ? school.fromdate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                type="date"
                value={
                  school.todate ? school.todate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setToDate(e.target.value)}
              />
              <button
                onClick={saveSchool}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
              >
                Save
              </button>
              {schoolRepo.metadata.apiDeleteAllowed(school) && (
                <button
                  onClick={deleteSchool}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
