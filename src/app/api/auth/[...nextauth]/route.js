// api/auth/[...nextauth]/route.js
// MongoDB
import { connectDB } from "@/lib/connectDB";

// Next Auth
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Bcrypt
import bcrypt from "bcrypt";

const handler = NextAuth({
  // Secret
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,

  providers: [
    CredentialsProvider({
      // Provider
      name: "Credentials",

      // Credentials
      credentials: {
        // email
        email: {
          label: "Email",
          type: "email",
          placeholder: "your@email.com",
          requires: true,
        },

        // password
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
          requires: true,
        },
      },

      // Authorization
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) throw new Error("Email and password required");

        const db = await connectDB();
        const user = await db.collection("Users").findOne({ email });
        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");

        return { email: user.email };
      },
    }),
  ],

  // Session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  // Pages
  pages: {
    signIn: "/Auth/Login",
  },

  // JWT & Session callbacks
  callbacks: {
    // JWT callback
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },

    // Session callback
    async session({ session, token }) {
      session.user = { email: token.email };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
