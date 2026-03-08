import { TemplateType } from '../../domain/interfaces';


export interface IMailService {
    sendMail(to: string[], templateType: TemplateType, data: Record<string, any>): Promise<void>;
}