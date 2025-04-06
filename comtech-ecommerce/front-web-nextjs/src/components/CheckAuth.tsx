'use client';

import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";

export default function CheckAuth() {

  const { status, data: session } = useSession();

  if(status !== 'loading') {
    if(!session?.user) {
      return redirect("/auth/signin");
    }
  }

  return null;
}