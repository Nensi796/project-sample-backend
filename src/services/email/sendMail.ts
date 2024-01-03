import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

export interface IEmailParams {
  to: string;
  from: string;
  name: string;
  subject: string;
  html?: string;
  dynamicTemplateData?: {
    reset_password_link?: string;
  };
}

export interface IEmailResponse {
  error: boolean;
  message: string;
}

export async function sendEmail(args: IEmailParams) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg: MailDataRequired = {
    to: args.to,
    from: {
      email: args.from,
      name: args.name,
    },
    subject: args.subject,
    html: args.html,
    dynamicTemplateData: args.dynamicTemplateData,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('sendEmail error', error.code);
    console.error('sendEmail error', error?.response?.body?.errors);
    return false;
  }
}
