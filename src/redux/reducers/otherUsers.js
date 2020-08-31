import {
	SET_OTHERS_INFO
} from 'redux/actions/otherUsers';

const defaultState = {
	otherUsers: {}
}

export default (state = defaultState, action) => {
	switch(action.type) {
		case SET_OTHERS_INFO:
				return {
					...state,
					[action.userId]: action.info,
				};
		default:
				return state;
	}
}