import { IEmailContext } from '../contexts';

export abstract class BaseEmailTemplate {
  template = (context: IEmailContext) => `<div>${context.title}</div>`;
}
