import { TemplateType } from "../interfaces";


export interface IMailService {
    sendMail(to: string[], templateType: TemplateType, data: Record<string, any>): Promise<void>;
}