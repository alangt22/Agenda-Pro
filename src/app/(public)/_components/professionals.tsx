import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import fotoImg from "../../../../public/foto1.png"
import Link from "next/link"
import { ArrowRight, MapPin, Sparkles, User } from "lucide-react"
import type { Prisma } from "@prisma/client"
import { PremiunCardBadge } from "./premiun-badge"
import { Button } from "@/components/ui/button"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfessionalProps {
  professionals: UserWithSubscription[]
}

export function Professionals({ professionals }: ProfessionalProps) {
  return (
    <section className="py-24 bg-zinc-200 dark:bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Profissionais <span className="text-green-500">Disponíveis</span>
          </h2>

          <p className="text-lg text-muted-foreground">Encontre e agende com os melhores profissionais da sua região</p>
        </div>

        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {professionals.map((clinic) => (
            <Card
              className="group overflow-hidden border-border/50 hover:border-green-500/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              key={clinic.id}
            >
              <CardContent className="p-0">
                <div className="relative h-56 overflow-hidden bg-muted">
                  <Image
                    src={clinic.image ?? fotoImg}
                    alt={`Foto de ${clinic.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" && (
                    <PremiunCardBadge />
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-green-500 transition-colors">
                      {clinic.name}
                    </h3>
                   <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 flex-shrink-0 mt-0.5" />
                     <span>{clinic.name_professional}</span>
                   </div>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{clinic.adress ?? "Endereço não informado"}</p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2 h-11 shadow-md hover:shadow-lg transition-all"
                  >
                    <Link href={`/clinica/${clinic.id}`} target="_blank">
                      Agendar horário
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  )
}
