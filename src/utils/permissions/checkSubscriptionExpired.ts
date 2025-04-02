"use server"

import { Session } from "next-auth"
import { addDays, isAfter } from "date-fns"
import { ResultPermissionProps } from "./canPermission";
import { TRIAL_DAYS } from "./trial-limit";

export async function checkSubscriptionExpired(session: Session): Promise<ResultPermissionProps> {
    const trialEndDate = addDays(session?.user?.createdAt!, TRIAL_DAYS)

    if(isAfter(new Date(), trialEndDate)){
        return{
            hasPermission: false,
            planId: "EXPIRED",
            expired: true,
            plan: null
        }
    }


    return{
        hasPermission: true,
        planId: "TRIAL",
        expired: false,
        plan: null
    }
    
}