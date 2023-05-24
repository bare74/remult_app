import { remultNext } from "remult/remult-next";
import ably from "ably/promises";
import { AblySubscriptionServer } from "remult/ably";
// import { TasksController } from "../../shared/TasksController";
import { findUserById } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { DataProviderLiveQueryStorage } from "remult/server";

import { Task } from "../../shared/Task";
import { createPostgresConnection } from "remult/postgres";

const dataProvider = createPostgresConnection();

export default remultNext({
  getUser: async (req) => findUserById((await getToken({ req }))?.sub),
  subscriptionServer: new AblySubscriptionServer(
    new ably.Rest(process.env["ABLY_API_KEY"]!)
  ),
  dataProvider,
  liveQueryStorage: new DataProviderLiveQueryStorage(dataProvider),
});

export const api = remultNext({
  entities: [Task],
  //   controllers: [TasksController],
});
