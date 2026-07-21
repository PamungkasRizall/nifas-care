import authConfig from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role, UserStatus } from "@/types";
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (user.id) {
        const hashedPassword = await bcrypt.hash("123456", 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status; // Mengambil status dari database saat login pertama kali
      }
      if (trigger === "update" && session?.status) {
        token.status = session.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        // session.user.status = token.status as UserStatus; // Memindahkan status dari token ke object session

        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { status: true, role: true },
          });
          if (dbUser) {
            session.user.status = dbUser.status;
            session.user.role = dbUser.role;
          } else {
            session.user.status = token.status as UserStatus;
          }
        } catch {
          session.user.status = token.status as UserStatus;
        }
      }
      return session;
    },
  },
});
