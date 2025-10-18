// api/auth/[...nextauth]/route.js
import { connectDB } from "@/lib/connectDB";

// Auth Server
import NextAuth from "next-auth";

// Providers
import CredentialsProvider from "next-auth/providers/credentials";

// Encryption
import bcrypt from "bcrypt";

const handler = NextAuth({
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your@email.com",
          requires: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
          requires: true,
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Basic validation
        if (!email || !password) throw new Error("Email and password required");

        // Connect to MongoDB
        const db = await connectDB();
        const user = await db.collection("Users").findOne({ email });

        if (!user) throw new Error("User not found");

        // Compare password with hashed one
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");

        // Return user object (omit password)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/Auth/Login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.type = user.type; // Include type in the JWT token
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
