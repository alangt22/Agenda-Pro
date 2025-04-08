// Backend meusite.com/api/schedule/get-appointments

import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl

    const userId = searchParams.get('userId')
    const dateParam = searchParams.get('date')

    if(!userId || userId === "null" || !dateParam || dateParam === "null" ) {
        return NextResponse.json({
            error: "Nenhum agendamento encontrado"
        }, {
            status: 400
        })
    }
    
    try {
        // converter a date recebida em um objeto Date
        const [year, month, day] = dateParam.split("-").map(Number)
        const startDate = new Date(Date.UTC(year, month - 1, day - 1, 0, 0, 0, 0));  // Meia-noite do dia 8
        const endDate = new Date(Date.UTC(year, month - 1, day - 1, 23, 59, 59, 999));  // Fim do dia 8
        
        console.log("Start Date (UTC):", startDate.toISOString())  // Data inicial no formato UTC
        console.log("End Date (UTC):", endDate.toISOString())  
        

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            return NextResponse.json({
                error: "Nenhum agendamento encontrado"
            }, {
                status: 400
            })
        }

        const appointments = await prisma.appoitments.findMany({
            where: {
                userId: userId,
                appointmentDate:{
                    gte: startDate,
                    lte: endDate,
                }
            },
            include:{
                service: true
            }
        })

        // montar com todos os (slots) ocupados
        const blockedSlots = new Set<string>() // 10:00

        for (const apt of appointments) {
            // ex: apt.time = "10:00", apt.service.duration = 60 (1h)
            const requieredSlots = Math.ceil(apt.service.duration / 30)
            const startIndex = user.times.indexOf(apt.time)

            if(startIndex !== -1) {
                for (let i = 0; i < requieredSlots; i++) {
                    const blockedSlot = user.times[startIndex + i]
                    if(blockedSlot){
                        blockedSlots.add(blockedSlot)
                    }
                }
            }
        }

        const blockedTimes = Array.from(blockedSlots)

        console.log("bktimes:",blockedTimes)

        return NextResponse.json(blockedTimes)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "Nenhum agendamento encontrado"
        }, {
            status: 400
        })
    }

}