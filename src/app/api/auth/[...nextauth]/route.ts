import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(password, user.password)
        return valid ? user : null
      },
    }),
    // e.g. GoogleProvider({ clientId, clientSecret })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
