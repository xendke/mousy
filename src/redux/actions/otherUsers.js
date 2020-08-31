export const SET_OTHERS_INFO = 'SET_OTHERS_INFO';

export function setOtherUserInfo(userId, info) {
	return {
		type: SET_OTHERS_INFO,
		userId,
		info
	}
}