'use client'
import Image from "next/image";
import AuthModal from "@/components/AuthModal/AuthModal.components"
import { useEffect } from "react";
import { useAppContext } from "@/components/Helps/AppContext";
import LogoutButton from "@/components/AuthModal/LogoutButton";

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {
  const { user } = useAppContext();
  // const user = await getUserMeLoader();
  
  // useEffect(async () => {
  //   const {data: user} = await getUserMeLoader();
  // }, [user])

  // console.log(user)

//   useEffect(() => {
//     if(typeof(user) == "object"){
      
//     }
// }, [user]);

  return (
    <main>
      
      {user? <LogoutButton /> : <AuthModal />}
    </main>
  );
}
