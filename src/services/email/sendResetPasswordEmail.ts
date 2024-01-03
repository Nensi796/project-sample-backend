import { ISignupEmailContext } from './email-templates/signup';
import { sendEmail, IEmailParams, IEmailResponse } from './sendMail';
import { ResetEmailTemplate } from './email-templates/resetPasswordTemplate';

export const sendResetPasswordEmail = async (
  toEmail: string,
  token: string,
  redirectUrl?: string,
): Promise<IEmailResponse> => {
  const context: ISignupEmailContext = {
    subject: 'Reset Your Password',
    title: 'Reset Your Password',
    toAddresses: toEmail,
    token,
    redirectUrl,
  };

  const email: IEmailParams = {
    to: toEmail,
    from: process.env.SENDGRID_SENDER_EMAIL,
    name: 'Mozarto',
    subject: 'Reset Your Password',
    html: new ResetEmailTemplate().template(context),
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
