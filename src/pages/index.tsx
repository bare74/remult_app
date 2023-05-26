import { remult, UserInfo } from "remult";
import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { Task } from "../shared/Task";
import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";

const taskRepo = remult.repo(Task);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const session = useSession();

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      //  setTasks([...tasks, newTask]);
      setNewTaskTitle("");
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
      return taskRepo
        .liveQuery({
          limit: 20,
          orderBy: { completed: "asc" },
        })
        .subscribe((info) => setTasks(info.applyChanges));
  }, [session]);
  if (session.status !== "authenticated") return <></>;
  return (
    <div>
      <h1>Todos</h1>
      <main>
        <div>
          Hello {remult.user?.name}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>

        {taskRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addTask}>
            <input
              value={newTaskTitle}
              placeholder="What needs to be done?"
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button>Add</button>
          </form>
        )}
        {tasks.map((task) => {
          const setTask = (value: Task) =>
            setTasks((tasks) => tasks.map((t) => (t === task ? value : t)));

          const setTitle = (title: string) => setTask({ ...task, title });

          const saveTask = async () => {
            try {
              await taskRepo.save(task);
            } catch (error: any) {
              alert(error.message);
            }
          };
          const deleteTask = async () => {
            try {
              await taskRepo.delete(task);
            } catch (error: any) {
              alert(error.message);
            }
          };
          return (
            <div key={task.id}>
              <input
                value={task.title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={saveTask}>Save</button>
              {taskRepo.metadata.apiDeleteAllowed(task) && (
                <button onClick={deleteTask}>Delete</button>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
