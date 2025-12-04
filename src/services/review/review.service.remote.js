import { httpService } from '../http.service'

export const reviewService = {
	add,
	remove
}

async function add(stayId,review) {
	return await httpService.post(`review/${stayId}`,review )
}

async function remove(stayId,reviewId) { 
	return await httpService.delete(`review/${stayId}/${reviewId}`)
}


 // remove review??  front+back is missing