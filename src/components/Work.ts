import { remult, UserInfo } from "remult";
import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { Work } from "../shared/Work";
import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";

const workRepo = remult.repo(Work);

export default function Home() {
  const [works, setWorks] = useState<Work[]>([]);
  const [newWorkName, setNewWorkName] = useState("");
  const [newWorkPosition, setNewWorkPosition] = useState("");
  const [newWorkFromDate, setNewWorkFromDate] = useState("");
  const [newWorkToDate, setNewWorkToDate] = useState("");
  const session = useSession();

  const addWork = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newWork = await workRepo.insert({ name: newWorkName });
      setNewWorkName("");
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
      return workRepo
        .liveQuery({
          limit: 20,
        })
        .subscribe((info) => setWorks(info.applyChanges));
  }, [session]);

  if (session.status !== "authenticated") return <></>;

  return (
    <div>
      <h1>Work</h1>
      <main>
        {workRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addWork}>
            <input
              value={newWorkName}
              placeholder="Company Name"
              onChange={(e) => setNewWorkName(e.target.value)}
            />
            <input
              value={newWorkPosition}
              placeholder="Position"
              onChange={(e) => setNewWorkPosition(e.target.value)}
            />
            <input
              type="date"
              value={newWorkFromDate}
              onChange={(e) => setNewWorkFromDate(e.target.value)}
            />
            <input
              type="date"
              value={newWorkToDate}
              onChange={(e) => setNewWorkToDate(e.target.value)}
            />
            <button>Add</button>
          </form>
        )}

        {works.map((work) => {
          const setWork = (value: Work) =>
            setWorks((prevWorks) =>
              prevWorks.map((w) => (w.id === work.id ? value : w))
            );

          const setName = (name: string) => setWork({ ...work, name });
          const setPosition = (position: string) =>
            setWork({ ...work, position });
          const setFromDate = (fromDate: string) =>
            setWork({ ...work, fromDate: new Date(fromDate) });

          const setToDate = (toDate: string) =>
            setWork({ ...work, toDate: new Date(toDate) });

          const saveWork = async () => {
            try {
              await workRepo.save(work);
            } catch (error: any) {
              alert(error.message);
            }
          };

          const deleteWork = async () => {
            try {
              await workRepo.delete(work);
            } catch (error: any) {
              alert(error.message);
            }
          };

          return (
            <div key={work.id}>
              <input
                value={work.name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                value={work.position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <input
                type="date"
                value={
                  work.fromDate ? work.fromDate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                value={
                  work.toDate ? work.toDate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setToDate(e.target.value)}
              />
              <button onClick={saveWork}>Save</button>
              {workRepo.metadata.apiDeleteAllowed(work) && (
                <button onClick={deleteWork}>Delete</button>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
