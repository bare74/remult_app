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
          fromDate: new Date(newSchoolFromDate),
          toDate: new Date(newSchoolToDate),
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
    <div>
      <main>
        {schoolRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addSchool}>
            <input
              value={newSchoolName}
              placeholder="School Name"
              onChange={(e) => setNewSchoolName(e.target.value)}
            />
            <input
              value={newSchoolOccupation}
              placeholder="Occupation"
              onChange={(e) => setNewSchoolOccupation(e.target.value)}
            />
            <input
              type="date"
              value={newSchoolFromDate}
              onChange={(e) => setNewSchoolFromDate(e.target.value)}
            />
            <input
              type="date"
              value={newSchoolToDate}
              onChange={(e) => setNewSchoolToDate(e.target.value)}
            />
            <button>Add</button>
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
            setSchool({ ...school, fromDate: new Date(fromDate) });

          const setToDate = (toDate: string) =>
            setSchool({ ...school, toDate: new Date(toDate) });

          const saveSchool = async () => {
            try {
              const { id, name, occupation, fromDate, toDate } = school;
              const updatedSchool = {
                id,
                name,
                occupation,
                fromDate,
                toDate,
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
                value={school.name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                value={school.occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
              <input
                type="date"
                value={
                  school.fromDate
                    ? school.fromDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                value={
                  school.toDate ? school.toDate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setToDate(e.target.value)}
              />
              <button onClick={saveSchool}>Save</button>
              {schoolRepo.metadata.apiDeleteAllowed(school) && (
                <button onClick={deleteSchool}>Delete</button>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
