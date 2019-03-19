export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_AUTH = 'SET_AUTH';

export function signIn() {
	return {
		type: SIGN_IN,
		isSignedIn: true,
	}
}
export function signOut() {
	return {
		type: SIGN_OUT,
		isSignedIn: false,
	}
}
export function setAuth(auth) {
	return {
		type: SET_AUTH,
		auth,
	}
}