import { httpService } from '../http.service'

export const stayService = {
    query,
    getById,
    save,
    remove
}

async function query(filterBy = {
    txt: '',
    city: '',
    labels: [],
    minPrice: 70,
    maxPrice: 3000,
    dates: {
        checkIn: null,
        checkOut: null
    },
    guests: {
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
    }
}) {
    // console.log('filterBy fron service:', filterBy);
    return httpService.get(`stay`, filterBy)
}

function getById(stayId) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}
async function save(stay) {
    if (stay._id) {
        return await httpService.put(`stay/${stay._id}`, stay)
    } else {
        return await httpService.post('stay', stay)
    }
}

// async function addStayMsg(stayId, txt) {
//     const savedMsg = await httpService.post(`stay/${stayId}/msg`, {txt})
//     return savedMsg
// }