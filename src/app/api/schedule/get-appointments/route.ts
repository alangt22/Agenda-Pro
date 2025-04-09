import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');
    const dateParam = searchParams.get('date');

    if (!userId || userId === "null" || !dateParam || dateParam === "null") {
        return NextResponse.json({
            error: "Nenhum agendamento encontrado"
        }, {
            status: 400
        });
    }

    try {
        
        const [year, month, day] = dateParam.split("-").map(Number); 
        

        let startDate, endDate;

            startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); 
            endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));  
        

        console.log("Start Date (UTC):", startDate); 
        console.log("End Date (UTC):", endDate);  

        
    

        // Buscar o usuário
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({
                error: "Nenhum agendamento encontrado"
            }, {
                status: 400
            });
        }

        // Buscar os agendamentos
        const appointments = await prisma.appoitments.findMany({
            where: {
                userId: userId,
                appointmentDate: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            include: {
                service: true
            }
        });

        // Criar um Set para armazenar os slots bloqueados
        const blockedSlots = new Set<string>();

        for (const apt of appointments) {
            // ex: apt.time = "10:00", apt.service.duration = 60 (1h)
            const requiredSlots = Math.ceil(apt.service.duration / 30);
            const startIndex = user.times.indexOf(apt.time);

            if (startIndex !== -1) {
                for (let i = 0; i < requiredSlots; i++) {
                    const blockedSlot = user.times[startIndex + i];
                    if (blockedSlot) {
                        blockedSlots.add(blockedSlot);
                    }
                }
            }
        }

        const blockedTimes = Array.from(blockedSlots);

        console.log("Blocked times:", blockedTimes);

        return NextResponse.json(blockedTimes);

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Nenhum agendamento encontrado"
        }, {
            status: 400
        });
    }
}
