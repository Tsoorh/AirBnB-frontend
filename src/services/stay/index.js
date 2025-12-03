const { DEV, VITE_LOCAL } = import.meta.env

// import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'


export function getEmptyStay() {
    const now = Date.now()
	return {
        name: '',
        type: '',
        summary:'',
        imgUrls: [],
        price: { 
            base: 0,
            currency: 'USD',
            cleaningFee: 0,
            serviceFeePct: 0.12
            },
        capacity: { 
            guests: 1,
            bedrooms: 0,
            beds: 0,
            bathrooms: 1
            },
        amenities: [],
        labels: [],
        host: {
            _id:'',
            fullname:'',
            picture: '',
            isSuperhost: false
        },
        loc: {
            country:'',
            countryCode:'',
            city: '',
            address: '',
            lat: null,
            lng: null
        },
        reviews: [],
        likedByUsersIds: [],
        houseRules: [],
        checkIn: {from: '15:00', to: '22:00'},  
        checkOut: { by: '11:00'},
        unavailable: [], //array of objects like this: { startDate: "2025-10-18", endDate: "2025-10-21" } that tells the stay is booked in this dates
        rating: {avg: 0, count: 0},
        createdAt: now,
        updatedAt: now,
	}
}

export function getDefaultFilter() {
    return {
        txt: '',
        city: '',
        // labels: [],
        // minPrice: 70,
        // maxPrice: 3000,
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
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
