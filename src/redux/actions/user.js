export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_AUTH = 'SET_AUTH';
export const SET_INFO = 'SET_INFO';

export function signIn(auth) {
	return {
		type: SIGN_IN,
		isSignedIn: true,
		auth,
	}
}
export function signOut(auth) {
	return {
		type: SIGN_OUT,
		isSignedIn: false,
		auth: null,
	}
}
export function setAuth(auth) {
	return {
		type: SET_AUTH,
		auth,
	}
}
export function setInfo(info) {
	return {
		type: SET_INFO,
		info,
	}
}