import { TemplateData } from '../../domain/interfaces';


export interface ITemplateService {
    loadTemplate(templateType: string, data: Record<string, any>): Promise<TemplateData>;
}
