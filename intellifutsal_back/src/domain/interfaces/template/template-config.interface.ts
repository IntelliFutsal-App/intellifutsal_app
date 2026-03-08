export interface TemplateConfig {
    [key: string]: {
        subject: string;
        fileName: string;
        requiredFields?: string[];
    };
}