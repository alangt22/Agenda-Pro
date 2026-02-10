import getSession from "@/lib/getSession";
import { ListHistory } from "./_components/listHistory";
import { redirect } from "next/navigation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historico | AgendaPRO",
  description: "Historico - AgendaPRO",
  robots:{
    index: false,
    follow: false,
    nocache: true
  },
};

export default async function History() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }
  return (
    <ListHistory />
  );
}