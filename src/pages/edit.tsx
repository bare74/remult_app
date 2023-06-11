import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { remult, UserInfo } from "remult";
import { School } from "../shared/School";
import { Work } from "../shared/Work";
import ably from "ably/promises";
import { AblySubscriptionClient } from "remult/ably";
import SchoolSection from "../components/SchoolSection";
import WorkSection from "../components/WorkSection";
import Navbar from "../components/Navbar";

const schoolRepo = remult.repo(School);
const workRepo = remult.repo(Work);

export default function Edit() {
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
    return (
      <div
        className="inline-block h-12 w-12 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
        ;
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div>
        <h1>Schools</h1>
        <main>
          <div>
            Hello {remult.user?.name}
            <button
              onClick={() => signOut()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
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
