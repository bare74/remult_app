import { signIn, useSession } from "next-auth/react";
import { remult, UserInfo } from "remult";
import { Work } from "../shared/Work";
import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";
import { FormEvent, useEffect, useState } from "react";

const workRepo = remult.repo(Work);

export default function Home() {
  const [works, setWorks] = useState<Work[]>([]);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkPlace, setNewWorkPlace] = useState("");
  const [newWorkText, setNewWorkText] = useState("");
  const [newWorkFromDate, setNewWorkFromDate] = useState("");
  const [newWorkToDate, setNewWorkToDate] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const { data: session, status } = useSession();

  const addWork = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newWork = await workRepo.insert([
        {
          title: newWorkTitle,
          workplace: newWorkPlace,
          text: newWorkText,
          fromdate: new Date(newWorkFromDate),
          todate: new Date(newWorkToDate),
        },
      ]);
      // Reset state variables
      setNewWorkTitle("");
      setNewWorkPlace("");
      setNewWorkText("");
      setNewWorkFromDate("");
      setNewWorkToDate("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
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
    <div className="Work">
      <main>
        {workRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addWork}>
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              value={newWorkPlace}
              placeholder="Jobb"
              onChange={(e) => setNewWorkPlace(e.target.value)}
            />
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              value={newWorkTitle}
              placeholder="Tittel"
              onChange={(e) => setNewWorkTitle(e.target.value)}
            />

            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              value={newWorkText}
              placeholder="Arbeids beskrivelse"
              onChange={(e) => setNewWorkText(e.target.value)}
            />
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              type="date"
              value={newWorkFromDate}
              onChange={(e) => setNewWorkFromDate(e.target.value)}
            />
            <input
              className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              type="date"
              value={newWorkToDate}
              onChange={(e) => setNewWorkToDate(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
              Add
            </button>
          </form>
        )}

        {works.map((work) => {
          const setWork = (value: Work) =>
            setWorks((prevWorks) =>
              prevWorks.map((w) => (w.id === work.id ? value : w))
            );

          const setTitle = (title: string) => setWork({ ...work, title });

          const setWorkPlace = (workplace: string) =>
            setWork({ ...work, workplace });

          const setText = (text: string) => setWork({ ...work, text });

          const setFromDate = (fromdate: string) =>
            setWork({ ...work, fromdate: new Date(fromdate) });

          const setToDate = (todate: string) =>
            setWork({ ...work, todate: new Date(todate) });

          const saveWork = async () => {
            try {
              const { id, title, workplace, text, fromdate, todate } = work;
              const updatedWork = {
                id,
                workplace,
                title,
                text,
                fromdate,
                todate,
                completed: true,
              };
              await workRepo.update(id, updatedWork);
            } catch (error: any) {
              console.log("Error saving work:", error.message);
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
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                value={work.workplace}
                onChange={(e) => setWorkPlace(e.target.value)}
              />
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                value={work.title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                value={work.text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                type="date"
                value={
                  work.fromdate ? work.fromdate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                className=" px-4 h-10 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                type="date"
                value={
                  work.todate ? work.todate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setToDate(e.target.value)}
              />
              <button
                onClick={saveWork}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
              >
                Save
              </button>
              {workRepo.metadata.apiDeleteAllowed(work) && (
                <button
                  onClick={deleteWork}
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
