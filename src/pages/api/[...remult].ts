import { remultNext } from "remult/remult-next";
import ably from "ably/promises";
import { AblySubscriptionServer } from "remult/ably";
import { findUserById } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { DataProviderLiveQueryStorage } from "remult/server";
import { School } from "../../shared/School";
import { Work } from "../../shared/Work";
import { createPostgresConnection } from "remult/postgres";

const dataProvider = createPostgresConnection();
export default remultNext({
  dataProvider,
  liveQueryStorage: new DataProviderLiveQueryStorage(dataProvider),
  subscriptionServer: new AblySubscriptionServer(
    new ably.Rest(process.env["ABLY_API_KEY"]!)
  ),
  getUser: async (req) => findUserById((await getToken({ req }))?.sub),
});

export const api = remultNext({
  entities: [School, Work],
});
