import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../lib/database.types';

const callback: NextApiHandler = async (req, res) => {
	// Create authenticated Supabase Client
	const supabase = createPagesServerClient<Database>({ req, res });

	const code = req.query.code;

	if (typeof code === 'string') {
		await supabase.auth.exchangeCodeForSession(code);
	}

	res.redirect('/');
};

export default callback;