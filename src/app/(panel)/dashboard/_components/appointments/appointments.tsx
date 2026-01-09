
import {getTimesClinic} from '../../_data-access/get-times-clinic'
import { AppointmentList } from './appointments-list'

export async function Appointments({userId}: {userId: string}) {

    const {times} = await getTimesClinic({userId: userId})
    const {name_professional} = await getTimesClinic({userId: userId})

    return(
        <AppointmentList times={times} name_professional={name_professional || ""}/>
    )
}