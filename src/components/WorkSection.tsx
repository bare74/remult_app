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
    <div>
      <main>
        {workRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addWork}>
            <input
              value={newWorkPlace}
              placeholder="Workplace"
              onChange={(e) => setNewWorkPlace(e.target.value)}
            />
            <input
              value={newWorkTitle}
              placeholder="Title"
              onChange={(e) => setNewWorkTitle(e.target.value)}
            />

            <input
              value={newWorkText}
              placeholder="Text"
              onChange={(e) => setNewWorkText(e.target.value)}
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
                value={work.workplace}
                onChange={(e) => setWorkPlace(e.target.value)}
              />
              <input
                value={work.title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                value={work.text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                type="date"
                value={
                  work.fromdate ? work.fromdate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                value={
                  work.todate ? work.todate.toISOString().split("T")[0] : ""
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
