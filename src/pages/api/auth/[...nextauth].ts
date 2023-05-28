import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserInfo } from "remult";

const validUsers: UserInfo[] = [
  { id: "1", name: "bjornarenielsen@yahoo.no", roles: ["admin"] },
];

export function findUserByEmail(email: string) {
  return validUsers.find((user) => user.name === email);
}

export function findUserById(id: string | undefined) {
  return validUsers.find((user) => user.id === id);
}

export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }
        const user = findUserByEmail(credentials.name);
        if (user && credentials.password === "test") {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user = findUserById(token.sub);
      return session;
    },
  },
});
