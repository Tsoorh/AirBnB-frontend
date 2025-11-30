import { httpService } from '../http.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
    getLoggedinUser,
    saveLoggedinUser,
}

async function getUsers() {
	return await httpService.get(`user`)
}

async function getById(userId) {
	return await httpService.get(`user/${userId}`)
}

async function remove(userId) {
	return await httpService.delete(`user/${userId}`)
}

async function update(user) {
	const savedUser = await httpService.put(`user/${user._id}`, user)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

	return savedUser
}

async function login(userCred) {
	if(!userCred.credentials) userCred.credentials={...userCred};
	console.log('user cred:', userCred)
	const user = await httpService.post('auth/login', userCred)
	if (!user) throw new Error('Login failed - no user returned')
	return saveLoggedinUser(user)
}

async function signup(userCred) {
	if(!userCred.credentials) userCred.credentials={...userCred};

	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        isAdmin: user.isAdmin 
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}
