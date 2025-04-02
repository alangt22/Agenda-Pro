import getSession from '@/lib/getSession'
import { redirect } from "next/navigation"
import { GridPlans } from "./_components/grid-plans"
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'
import { Suspense } from 'react'
import { Loader } from 'lucide-react'




export default async function Plans() {
    const session = await getSession()

    if(!session) {
        redirect('/')
    }


    const subscription = await getSubscription({userId: session?.user?.id!})



    return(
        <Suspense fallback={<Loader size={16} color="#131313" className="animate-spin flex text-center"/>}>
            <div>
                {subscription?.status !== "active" && (
                    <GridPlans/>
                )}

                {subscription?.status === "active" && (
                    <SubscriptionDetail subscription={subscription!}/>
                )}
            </div>
        </Suspense>
    )
}