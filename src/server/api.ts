import { createPostgresConnection } from "remult/postgres";
import { remultNext } from "remult/remult-next";

export const api = remultNext({
  //...
  dataProvider: createPostgresConnection(),
});
