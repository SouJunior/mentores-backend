export type EmailTemplateType = {
  email: string | string[];
  subject: string;
  template: string;
  context?: {
    [name: string]: any;
  };
};
