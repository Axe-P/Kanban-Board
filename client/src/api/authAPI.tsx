import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('Login successful, token stored:', data.token);
      window.location.assign('/');
    } else {
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export { login };