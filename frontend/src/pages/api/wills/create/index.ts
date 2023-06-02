import { User } from '@prisma/client'
import { NextApiResponse } from 'next'

interface User {
  email: string
}

interface RequestBody {
  owner: User
}

export default async function POST(req: Request, res: NextApiResponse) {
  const body = req.body as unknown as RequestBody
  try {
    return res.status(200).json({ will: body })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
