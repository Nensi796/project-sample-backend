import {
  ISignupEmailContext,
  SignupEmailTemplate,
} from './email-templates/signup';
import { sendEmail, IEmailParams, IEmailResponse } from './sendMail';

export const sendSignupEmail = async (
  toEmail: string,
  token: string,
  redirectUrl?: string,
): Promise<IEmailResponse> => {
  const context: ISignupEmailContext = {
    subject: 'Verify Your Email Address',
    title: 'Verify Your Email Address',
    toAddresses: toEmail,
    token,
    redirectUrl,
  };

  const email: IEmailParams = {
    to: toEmail,
    from: process.env.SENDGRID_SENDER_EMAIL,
    name: 'Mozarto',
    subject: 'Verify Your Email Address',
    html: new SignupEmailTemplate().template(context),
  };

  try {
    await sendEmail(email);
    return {
      error: false,
      message: `Verification email sent to: ${toEmail}`,
    };
  } catch (error) {
    console.log('sendSignupEmail', error);

    return {
      error: true,
      message:
        'Technical Issue!, Please click on resend for verify your Email.',
    };
  }
};
