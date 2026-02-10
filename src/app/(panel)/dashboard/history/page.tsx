import getSession from "@/lib/getSession";
import { ListHistory } from "./_components/listHistory";
import { redirect } from "next/navigation";


export default async function History() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }
  return (
    <ListHistory />
  );
}