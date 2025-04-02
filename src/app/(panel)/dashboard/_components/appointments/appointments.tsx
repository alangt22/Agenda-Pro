
import {getTimesClinic} from '../../_data-access/get-times-clinic'
import { AppointmentList } from './appointments-list'

export async function Appointments({userId}: {userId: string}) {7

    const {times} = await getTimesClinic({userId: userId})


    return(
        <AppointmentList times={times}/>
    )
}