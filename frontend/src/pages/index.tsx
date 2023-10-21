import { useSession, useUser } from "@supabase/auth-helpers-react";
import Login from "./auth/login";

export default function Home(){
  const user = useUser();
  const session = useSession();

  if(!user)
    return <Login />

  return (
    <>
    <h1>Dashboard:</h1>
    <p>{JSON.stringify(user)}</p>
    </>
  )
}
