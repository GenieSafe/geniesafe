import { NextApiRequest, NextApiResponse } from 'next'
import { createSupabaseServer } from '../../lib/createSupabaseAdmin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, address } = req.body
  const supabase = createSupabaseServer()

  await supabase.auth.admin.updateUserById(id, {
    user_metadata: { address: address },
  });
  return res.status(200).end();
}
