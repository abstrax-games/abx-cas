import { Backend } from "../libs/settings";
import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

export class UserServices {
    protected static backendUrl = Backend.url;

    public static async register(username: string, email: string, password: string, emailCaptcha: string, service?: string): Promise<any> {
        try {
            if (service === "default") {
                service = undefined;
            }
            const res = await axios.post(`${this.backendUrl}/auth/register`, { username, email, password, emailCaptcha, serviceId: service });
            return res.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data;
            }
            return {
                success: false,
                message: (error as any).message ?? 'Error registering user',
            }
        }
    }

    public static async login(username: string, password: string, service?: string): Promise<any> {
        try {
            if (service === "default") {
                service = undefined;
            }
            const res = await axios.post(`${this.backendUrl}/auth/login`, { username, password, serviceId: service });
            return res.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data;
            }
            return {
                success: false,
                message: (error as any).message ?? 'Error logging in',
            }
        }
    }
}

