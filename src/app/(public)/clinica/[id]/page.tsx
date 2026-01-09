import { redirect } from "next/navigation";
import { getInfoSchedule } from "./_data-access/get-info-schedule";
import { ScheduleContent } from "./_components/schedule-content";

// Função dinâmica para gerar metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const user = await getInfoSchedule({ userId });

  if (!user) {
    return {
      title: "AgendaPRO",
      description: "Encontre os melhores barbeiros e agende horários online.",
    };
  }

  return {
    title: `Agendamento com ${user.name} | AgendaPRO`,
    description: `Agende horários com ${user.name}, profissional na AgendaPro. `,
    keywords: [
      "estética",
      "clínica de estética",
      "esmalteria",
      "salão de beleza",
      "manicure e pedicure",
      "alongamento de unhas",
      "nail designer",
      "design de unhas",
      "cuidados com a pele",
      "tratamentos estéticos",
      "limpeza de pele",
      "estética facial",
      "estética corporal",
      "agendamento online estética",
      "marcar horário estética",
      "salão de beleza perto de mim",
      "esmalteria perto de mim",
      "agenda online estética",
      "agendamento online",
      "AgendaPRO",
    ],

    openGraph: {
      title: `Agendamento com ${user.name} | AgendaPRO`,
      description: `Agende horários com ${user.name}, profissional na AgendaPRO. `,
      url: `${process.env.NEXT_PUBLIC_URL}/clinica/${user.id}`,
      type: "website",
      images: [`${process.env.NEXT_PUBLIC_URL}/logoAgendaPRO.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Agendamento com ${user.name} | AgendaPRO`,
      description: `Agende horários com ${user.name}, profissional na AgendaPRO.`,
      images: [`${process.env.NEXT_PUBLIC_URL}/logoAgendaPRO.png`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/clinica/${user.id}`,
    },
    authors: [{ name: "AgendaPRO" }],
    creator: "AgendaPRO",
    publisher: "AgendaPRO",
    applicationName: "AgendaPRO",
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const user = await getInfoSchedule({ userId: userId });

  if (!user) {
    redirect("/");
  }

  return <ScheduleContent clinic={user} />;
}
