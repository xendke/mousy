import {
	SIGN_IN,
	SIGN_OUT,
	SET_AUTH
} from 'redux/actions/user';

export default (state = {}, action) => {
	switch(action.type) {
		case SIGN_OUT:
		case SIGN_IN:
			return {
				...state,
				isSignedIn: action.isSignedIn,
				auth: action.auth,
			};
		case SET_AUTH:
			return {
				...state,
				auth: action.auth,
			};
		default:
				return state;
	}
}