import * as dotenv from "dotenv";
import { IMailService } from "../mail.service.interface";
import { TemplateService } from "./template.service";
import { TemplateType } from "../../interfaces";
import { BadRequestException } from "../../exceptions";
import { EMAIL_FAILED } from "../../utilities/messages.utility";
import nodemailer, { Transporter } from "nodemailer";
import { MailDataSource } from "../../config/mail-source.config";


dotenv.config();

export class MailService implements IMailService {
    private readonly templateService: TemplateService;
    private transporter: Transporter;

    constructor() {
        this.templateService = new TemplateService();
        this.transporter = nodemailer.createTransport(MailDataSource);
    }

    public sendMail = async (to: string[], templateType: TemplateType, data: Record<string, any>): Promise<void> => {
        try {
            await this.transporter.verify();
            
            const templateData = await this.templateService.loadTemplate(templateType, data);
            
            await this.transporter.sendMail({
                to: to,
                subject: templateData.subject,
                html: templateData.html
            });
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
                this.handleEmailError(to, templateType, error as Error);
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
                this.handleEmailError(to, templateType, error as Error);
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
                    this.handleEmailError(to, templateType, error as Error);
                    resolve(false); 
                }
            });
        });
    }

    private handleEmailError = (to: string[], templateType: TemplateType, error: Error): void => {
        console.error('Email Error Details:', {
            recipients: to,
            templateType,
            timestamp: new Date().toISOString(),
            error: error.message,
        });
    }
}