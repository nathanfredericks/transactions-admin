import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.TRANSACTIONS_AUTH0_CLIENT_ID || "",
      clientSecret: process.env.TRANSACTIONS_AUTH0_CLIENT_SECRET || "",
      issuer: process.env.TRANSACTIONS_AUTH0_ISSUER || "",
    })
  ],
  secret: process.env.TRANSACTIONS_AUTH_SECRET || "",
}

export default NextAuth(authOptions)

