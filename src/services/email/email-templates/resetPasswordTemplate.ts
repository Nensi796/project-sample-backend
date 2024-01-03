import mjml2html from 'mjml';
import { BaseEmailTemplate } from './baseEmailTemplate';

export interface IResetPasswordContext {
  subject: string;
  title: string;
  toAddresses: string;
  token: string;
}

export class ResetEmailTemplate extends BaseEmailTemplate {
  template = (context: IResetPasswordContext) => {
    const { CLIENT_URL } = process.env;
    // TODO: once we deploy logo on frontend side then we will add image url here
    const logo =
      'data:image/png;base64,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';
    return mjml2html(
      `
    <mjml>
    <mj-head>
      <mj-title>Mozarto</mj-title>
      <mj-preview>Email Verification</mj-preview>
      <mj-attributes>
        <mj-all font-family="Avenir Medium, Helvetica Neue, Helvetica, Arial, sans-serif"></mj-all>
        <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="Avenir Medium, 'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
      </mj-attributes>
      <mj-style inline="inline">
        .body-section {
        -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
        box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
        }
      </mj-style>
      <mj-style inline="inline">
        .text-link {
        color: #5e6ebf
        }
      </mj-style>
      <mj-style inline="inline">
        .footer-link {
        color: #888888
        }
      </mj-style>

    </mj-head>
    <mj-body background-color="#E7E7E7" width="692px">

      <mj-wrapper padding-top="0" padding-bottom="0">
        <mj-section>
          <mj-column width="100%">
            <mj-image align="center" src={logo} alt="" width="254px" height="48px" />
          </mj-column>
        </mj-section>
      </mj-wrapper>

      <mj-wrapper padding-top="0" background="unset" padding-bottom="0" css-class="body-section">
          <mj-section padding-left="15px" padding-right="15px" padding-top="20px" padding-bottom="20px">
            <mj-column width="100%">
              <mj-text font-weight="bold" font-size="20px" align="center" >
                Password Reset </mj-text>
              <mj-text font-size="14px" font-style='normal' font-weight='400' align="center">
                Click the link below to reset your password:
              </mj-text>
              <mj-button background-color="#2E672F" font-weight="bold" align="center" font-size="15px" href="${CLIENT_URL}/validate-reset-token?token=${context.token}" width="200px" height="36px" padding-top="20px" border-radius="5px" letter-spacing="-0.293248px">
                Reset your password
              </mj-button>
              <mj-text font-style='normal' font-size="14px" align="center" line-height="12px" font-weight="400"  width="348px" height="54px">
            If you did not request a password reset, you can safely ignore<br></br> this email. Only a person with access to your email can reset <br></br>your account password.
          </mj-text>

            </mj-column>
          </mj-section>
        </mj-wrapper>

    </mj-body>
    </mjml>
    `,
      {},
    ).html;
  };
}
