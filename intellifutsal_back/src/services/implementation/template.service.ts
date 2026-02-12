import path from "path";
import * as fs from "fs/promises";
import { TemplateConfig, TemplateData, TemplateType } from "../../interfaces";
import { ITemplateService } from "../template.service.interface";
import { BadRequestException, InternalServerException } from "../../exceptions";
import { TEMPLATE_ERROR, TEMPLATE_FIELDS_REQUIRED, TEMPLATE_NAME, TEMPLATE_NOT_FOUND } from "../../utilities/messages.utility";


export class TemplateService implements ITemplateService {
    private readonly templatesBasePath: string;
    private templateConfig: TemplateConfig;

    constructor() {
        this.templatesBasePath = "./public/templates";
        this.templateConfig = {
            welcome: {
                subject: "¡Bienvenid@ {{name}}!",
                fileName: "welcome-template.html",
                requiredFields: ["name", "email", "registrationDate", "loginUrl"]
            }
        };
    }

    public loadTemplate = async (templateType: TemplateType, data: Record<string, any>): Promise<TemplateData> => {
        const config = this.templateConfig[templateType];
        if (!config) throw new BadRequestException(`${ TEMPLATE_NAME }${ templateType }${ TEMPLATE_NOT_FOUND }`);

        this.validateRequiredFields(templateType, data, config.requiredFields);

        const html = await this.loadAndProcessTemplate(config.fileName, data);
        const subject = this.processTemplate(config.subject, data);

        return { subject, html };
    }

    private validateRequiredFields = (templateType: string, data: Record<string, any>, requiredFields?: string[]): void => {
        if (!requiredFields) return;

        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) throw new BadRequestException(`${ TEMPLATE_NAME }${ templateType }${ TEMPLATE_FIELDS_REQUIRED }${ missingFields.join(", ") }`);
    }

    private loadAndProcessTemplate = async (fileName: string, data: Record<string, any>): Promise<string> => {
        try {
            const templatePath = path.join(this.templatesBasePath, fileName);
            const template = await fs.readFile(templatePath, "utf-8");
            
            return this.processTemplate(template, data);
        } catch (error) {
            throw new InternalServerException(`${ TEMPLATE_NAME }${ fileName }${ TEMPLATE_ERROR }${ this.getErrorMessage(error) }`);
        }
    }

    private processTemplate = (template: string, data: Record<string, any>): string => {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            const value = data[key];

            if (value === undefined || value === null) return match; 
            
            return String(value);
        });
    }

    private getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        
        return String(error);
    }
}
