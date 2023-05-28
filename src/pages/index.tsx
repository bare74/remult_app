import { remult, UserInfo } from "remult";
import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { School } from "../shared/School";
import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";

const schoolRepo = remult.repo(School);

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolOccupation, setNewSchoolOccupation] = useState("");
  const [newSchoolFromDate, setNewSchoolFromDate] = useState("");
  const [newSchoolToDate, setNewSchoolToDate] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const session = useSession();

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
    remult.apiClient.subscriptionClient = new AblySubscriptionClient(
      new ably.Realtime({ authUrl: "/api/getAblyToken" })
    );
  }, []);

  useEffect(() => {
    remult.user = session.data?.user as UserInfo;
    if (session.status === "unauthenticated") signIn();
    else if (session.status === "authenticated")
      return schoolRepo
        .liveQuery({
          limit: 20,
        })
        .subscribe((info) => {
          setSchools(info.applyChanges);
          setLoading(false); // Set loading state to false when data is fetched
        });
  }, [session]);

  if (session.status !== "authenticated") return <></>;

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }
  return (
    <div>
      <h1>Schools</h1>
      <main>
        <div>
          Hello {remult.user?.name}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>

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
