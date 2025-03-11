import { SERVER_API } from "../../services/serviceConfig";
import axiosInstance from "../../utils/axiosInstance";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH_START' });

    const response = await axiosInstance.post(
      `${SERVER_API}/api/auth/login`, 
      { email, password }
    );
    const { userRole, accessToken, refreshToken } = response.data;

    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { userRole, accessToken, refreshToken }
    });
  }
  catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.response?.data?.message || 'Log in failed'
    });
    throw error;
  }
};

export const logout = (refreshToken) => async (dispatch) => {

  try {
    await axiosInstance.post(
      `${SERVER_API}/api/auth/logout`, 
      { refreshToken }
    );
  
    dispatch({ type: 'LOGOUT' });
  }
  catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.response?.data?.message || 'Log out failed'
    });
    throw error;
  }
};

export const refreshTokenAction = () => async (dispatch, getState) => {
  try {
    const { refreshToken } = getState().auth;
    
    const response = await axiosInstance.post(`${SERVER_API}/api/auth/refresh`, { refreshToken });

    const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        ...getState().auth,
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