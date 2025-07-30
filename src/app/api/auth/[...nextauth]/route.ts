import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // or "@/lib/authOptions" if you moved it

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
