import { Backend } from "../libs/settings";
import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

export class BaseServices {
    protected static backendUrl = Backend.url;

    public static async sendEmailCaptcha(email: string, imgCaptcha: string): Promise<any> {
        try {
            const res = await axios.post(`${this.backendUrl}/captcha`, { target: email, type: 1, imgCaptcha });
            return res.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data;
            }
            return {
                success: false,
                message: (error as any).message ?? 'Error sending email captcha',
            }
        }
    }

    public static async getAuthTickets() {
        try {
            const res = await axios.get(`${this.backendUrl}/auth/tickets`);
            return res.data;
        }
        catch (error) {
            return error;
        }
    }
}