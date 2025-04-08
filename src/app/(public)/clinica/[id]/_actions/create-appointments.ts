"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    date: z.date(),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
    time: z.string().min(1, "O horário é obrigatório"),
    clinicId: z.string().min(1, "O horário é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>


export async function createNewAppointment(formData: FormSchema) {
    const schema = formSchema.safeParse(formData)

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try {
        const selectedDate = new Date(formData.date);
        selectedDate.setHours(0, 0, 0, 0); // Garantir que a hora será 00:00 para o dia

        // Converte a data para o formato UTC
        const appointmentDate = selectedDate.toISOString(); 

        console.log('DATA AGENDADA', appointmentDate)

        // Aguarda a criação do novo agendamento
        const newAppointment = await prisma.appoitments.create({
            data: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                time: formData.time,
                appointmentDate: appointmentDate, // Armazenando no formato UTC
                serviceId: formData.serviceId,
                userId: formData.clinicId 
            }
        })

        return{
            data: newAppointment
        }
        
    } catch (error) {
        console.log(error)
        return{
            error: "Erro ao cadastrar agendamento"
        }
    }
}