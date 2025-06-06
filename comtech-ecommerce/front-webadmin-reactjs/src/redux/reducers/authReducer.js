const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: null,
  error: null,
}

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'AUTH_START': 
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS': 
      return {
        ...state,
        loading: false,
        user: action.payload.userInfo,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null
      };
    case 'AUTH_FAIL': 
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT': 
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null
      };
    default: 
      return state;
  }
}

export default authReducer;