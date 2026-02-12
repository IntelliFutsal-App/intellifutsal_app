import { TemplateData } from "../interfaces";


export interface ITemplateService {
    loadTemplate(templateType: string, data: Record<string, any>): Promise<TemplateData>;
}
