import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <section>
      <Suspense fallback={<Loader size={16} color="#131313" className="animate-spin flex text-center"/>}>
        <ServicesContent userId={session.user?.id!} />
      </Suspense>
    </section>
  );
}
