import fs from 'fs/promises';
import { compile } from 'handlebars';

interface ITemplateVariable {
  [key: string]: string | number;
}

export interface ICompilerTemplate {
  template: string;
  variables: ITemplateVariable;
}

export class HtmlCompiler {
  public async parse({ template, variables }: ICompilerTemplate) {
    const contentTemplate = await fs.readFile(template, {
      encoding: 'utf-8',
    });
    const parseTemplate = compile(contentTemplate);
    return parseTemplate(variables);
  }
}
