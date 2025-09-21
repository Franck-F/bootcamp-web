import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: 'admin' | 'moderator' | 'customer'
    }
  }

  interface User {
    role: 'admin' | 'moderator' | 'customer'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'moderator' | 'customer'
  }
}
