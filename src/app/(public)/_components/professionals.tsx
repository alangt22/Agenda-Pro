import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
 } from "@/components/ui/card";
import Image from "next/image";
import fotoImg from '../../../../public/foto1.png'
import Link from "next/link";
import { ArrowRight, Heading1 } from "lucide-react";
import { Prisma } from "@prisma/client";
import { PremiunCardBadge } from "./premiun-badge";

type UserWithSubscription = Prisma.UserGetPayload<{
    include:{
        subscription:true
    }
}>

interface ProfessionalProps{
    professionals: UserWithSubscription[]
}

export function Professionals({professionals}: ProfessionalProps) {
    return(
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4sm:px-6 lg:px-8">
                <h2 className="text-3xl text-center mb-12 font-bold">
                    Clinicas disponiveis
                </h2>

                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {professionals.map((clinic) => (
                        <Card className="overflow-hidden py-0 hover:shadow-lg duration-300" key={clinic.id}>
                            <CardContent className="p-0">
                                <div>
                                    <div className="relative h-48">
                                        <Image
                                            src={clinic.image ?? fotoImg}
                                            alt="Foto da clinica"
                                            fill
                                            className="object-cover"
                                        />
                                        {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" && <PremiunCardBadge/>}
                                    </div>
                                </div>
    
                                <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                {clinic.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                {clinic.adress ?? "Endereço não informado"}
                                            </p>
                                        </div>
    
                                    </div>
    
                                    <Link
                                        href={`/clinica/${clinic.id}`}
                                        target="_blank"
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium"
                                    >
                                        Agendar horario
                                        <ArrowRight className="ml-2"/>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </section>
    )
}