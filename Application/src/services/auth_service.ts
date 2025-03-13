import {
  SigninFormProps,
  SignupFormProps,
  ValidationErrors,
} from "../models/auth";
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
export class AuthService {
  // ----------------------------- //
  // -----------signin------------ //
  // ----------------------------- //
  async signin(userData: SigninFormProps): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, userData, {
        headers: {
          Authorization: API_KEY + ":",
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Error signing in: ${error.message}`);
    }
  }

  // ----------------------------- //
  // -----------signup------------ //
  // ----------------------------- //
  async signup(userData: SignupFormProps): Promise<AxiosResponse> {
    try {
      console.log(API_KEY)
      const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
        headers: {
          Authorization: API_KEY + ":",
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Error signing up: ${error.message}`);
    }
  }

  // ------------------------------------ //
  // -----------resetPassword------------ //
  // ------------------------------------ //
  async resetPassword(userData: SigninFormProps): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, userData, {
        headers: {
          Authorization: API_KEY + ":",
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Error signing up: ${error.message}`);
    }
  }

  // ------------------------------------ //
  // -----------validateLogin------------ //
  // ------------------------------------ //
  validateLogin(loginForm: SigninFormProps): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!loginForm.login) {
      errors.username = "Username is required";
    }
    if (!loginForm.password) {
      errors.password = "Password is required";
    }
    return errors;
  }

  // -------------------------------------------- //
  // -----------validateResetPassword------------ //
  // -------------------------------------------- //
  validateResetPassword(loginForm: SigninFormProps): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!loginForm.login) {
      errors.email = "Email is required";
    }
    if (!loginForm.password) {
      errors.password = "Password is required";
    }
    return errors;
  }

  // ------------------------------------- //
  // -----------validateSignup------------ //
  // ------------------------------------- //
  validateSignup(signupForm: SignupFormProps): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!signupForm.username) {
      errors.username = "Username is required";
    }
    if (!signupForm.email) {
      errors.email = "Email address is required";
    }
    if (!signupForm.password) {
      errors.password = "Password is required";
    } else if (signupForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    return errors;
  }
}
