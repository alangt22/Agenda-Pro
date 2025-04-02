
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getUserData } from './_data-access/get-info-user'
import { ProfileContent } from './_components/profile'
import { Suspense } from 'react'
import { Loader } from 'lucide-react'


export default async function Profile() {
    const session = await getSession()

    if(!session){
        redirect('/')
    }

    const user = await getUserData({userId: session.user?.id})

    if(!user){
        redirect('/')
    }

    return( 
        <Suspense fallback={<Loader size={16} color="#131313" className="animate-spin flex text-center"/>}>
            <ProfileContent user={user}/>
        </Suspense>
    )
}