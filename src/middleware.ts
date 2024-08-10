import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.TRANSACTIONS_AUTH_SECRET || "",
})