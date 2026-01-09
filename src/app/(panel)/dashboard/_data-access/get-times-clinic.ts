"use server"

import prisma from "@/lib/prisma"

export async function getTimesClinic({userId}: {userId: string}) {
    if(!userId){
        return{
            times: [],
            userId: ""
        }
    }

    try {

        const user = await prisma.user.findFirst({
            where:{
                id: userId
            },
            select:{
                id: true,
                times: true,
                name_professional: true
            }
        })

        if(!user){
            return {
                times: [],
                userId: "",
                name_professional: ""
            }
        }

        return {
            times: user.times,
            userId: user.id,
            name_professional: user.name_professional
        }
        
    } catch (error) {
        console.log(error)
        return{
            times: [],
            userId: "",
            name_professional: ""
        }
    }
}