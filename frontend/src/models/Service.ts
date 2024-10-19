import axios, { AxiosResponse } from 'axios';
import APIResponse from './APIResponse';

import { Backend } from '../libs/settings';

interface ServiceData {
    id?: number;
    serviceId?: string;
    serviceName?: string;
    servicePath?: string;
    privilegeKeys?: string;
}

export default class Service {
    id?: number;
    serviceId?: string;
    serviceName?: string;
    servicePath?: string;
    privilegeKeys?: string;

    constructor(id?: number, serviceId?: string, serviceName?: string, servicePath?: string, privilegeKeys?: string) {
        this.id = id;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.servicePath = servicePath;
        this.privilegeKeys = privilegeKeys;
    }

    async fetch(serviceId: string) {
        try {
            const serviceRes: AxiosResponse<APIResponse<ServiceData>> = await axios.get(`${Backend.url}/service/${serviceId}`, {
                withCredentials: true
            });
            const data = serviceRes.data;
            if (data.success) {
                const { id, serviceName, servicePath, privilegeKeys } = data.data;
                this.id = id;
                this.serviceId = serviceId;
                this.serviceName = serviceName;
                this.servicePath = servicePath;
                this.privilegeKeys = privilegeKeys;
            }
            else {
                throw new Error(data.message);
            }
        }
        catch (e: any) {
            throw e;
        }
    }
}