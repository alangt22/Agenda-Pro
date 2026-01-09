import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getUserData } from "./_data-access/get-info-user";
import { ProfileContent } from "./_components/profile";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();

  if (!session) {
    return {
      title: "Perfil - AgendaPRO",
      description: "Perfil - AgendaPRO",
    };
  }

  return {
    title: `Perfil | ${session.user?.name} - AgendaPRO`,
    description: `Área de perfil do usuário ${session.user?.name}.`,
    authors: [{ name: "AgendaPRO" }],
    creator: "AgendaPRO",
    publisher: "AgendaPRO",
    applicationName: "AgendaPRO",
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await getUserData({ userId: session.user?.id });

  if (!user) {
    redirect("/");
  }

  return <ProfileContent user={user} />;
}
