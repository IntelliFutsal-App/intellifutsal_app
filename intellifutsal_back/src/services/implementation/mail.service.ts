import * as dotenv from "dotenv";
import { IMailService } from "../mail.service.interface";
import { TemplateService } from "./template.service";
import { TemplateType } from "../../interfaces";
import { BadRequestException } from "../../exceptions";
import { EMAIL_FAILED, FROM_EMAIL_MISSING, SENDGRID_API_KEY_MISSING } from "../../utilities/messages.utility";
import sgMail from "@sendgrid/mail";


dotenv.config();

export class MailService implements IMailService {
    private readonly templateService: TemplateService;
    private readonly apiKey: string;

    constructor() {
        this.templateService = new TemplateService();
        this.apiKey = `${ process.env.SENDGRID_API_KEY }`;

        if (!this.apiKey) throw new Error(SENDGRID_API_KEY_MISSING);
        sgMail.setApiKey(this.apiKey);
    }

    public sendMail = async (to: string[], templateType: TemplateType, data: Record<string, any>): Promise<void> => {
        try {
            const templateData = await this.templateService.loadTemplate(templateType, data);
            
            const fromEmail = process.env.FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL;
            if (!fromEmail) throw new Error(FROM_EMAIL_MISSING);

            const msg = {
                to: to,
                from: fromEmail,
                subject: templateData.subject,
                html: templateData.html
            };

            await sgMail.send(msg);
        } catch (error) {
            const err = error as Error;
            throw new BadRequestException(`${ EMAIL_FAILED }${ err.message }`);
        }
    }

    public sendMailAsync = (to: string[], templateType: TemplateType, data: Record<string, any>): void => {
        setImmediate(async () => {
            try {
                await this.sendMail(to, templateType, data);
            } catch (error) {
                this.handleEmailError(to, templateType, data, error as Error);
            }
        });
    }

    public sendMailWithCallback = (to: string[], templateType: TemplateType, data: Record<string, any>, onSuccess?: () => void, onError?: (error: Error) => void): void => {
        setImmediate(async () => {
            try {
                await this.sendMail(to, templateType, data);
                onSuccess?.();
            } catch (error) {
                onError?.(error as Error);
                this.handleEmailError(to, templateType, data, error as Error);
            }
        });
    }

    public sendMailBackground = (to: string[], templateType: TemplateType, data: Record<string, any>): Promise<boolean> => {
        return new Promise((resolve) => {
            setImmediate(async () => {
                try {
                    await this.sendMail(to, templateType, data);
                    resolve(true);
                } catch (error) {
                    this.handleEmailError(to, templateType, data, error as Error);
                    resolve(false); 
                }
            });
        });
    }

    private handleEmailError = (to: string[], templateType: TemplateType, data: Record<string, any>, error: Error): void => {
        console.error('Email Error Details:', {
            recipients: to,
            templateType,
            timestamp: new Date().toISOString(),
            error: error.message,
            data: { ...data, password: undefined }
        });
    }
}