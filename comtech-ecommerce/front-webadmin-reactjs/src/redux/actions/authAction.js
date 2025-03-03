import axiosInstance from "../../utils/axiosInstance";

export const login = (pbcmcd, pbuser, pbpass) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH_START' });

    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`, 
      { pbcmcd, pbuser, pbpass }
    );

    if(response.data.RESULT_CODE === "0") {
      const resultData = response.data.RESULT_DATA;
      const loginPayload = {
        user: {
          
          expires: resultData.EXPIRES,
        },
        accessToken: resultData.ACCESSTOKEN,
      };
  
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: loginPayload
      });
    }
    else {
      dispatch({
        type: 'AUTH_FAIL',
        payload: 'Login failed'
      });
      throw new Error('Login failed due to: ' + response.data.RESULT_REASON);
    }
  }
  catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.response?.data?.message || 'Login failed'
    });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' });
};

export const refreshTokenAction = () => async (dispatch, getState) => {
  try {
    const { refreshToken } = getState().auth;
    
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, { refreshToken });

    const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        ...getState().auth.user,
        accessToken: newToken,
        refreshToken: newRefreshToken
      }
    });

    return newToken;
  }
  catch (error) {
    dispatch({ type: 'LOGOUT' });
    throw(error);
  }
}