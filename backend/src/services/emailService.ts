import { Resend } from 'resend';

export const sendPurchaseConfirmation = async ({
  to,
  buyerUsername,
  doodleTitle,
  price,
  remainingBalance,
}: {
  to: string;
  buyerUsername: string;
  doodleTitle: string;
  price: number;
  remainingBalance: number;
}) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'Doodle Market <onboarding@resend.dev>',
    to,
    subject: `Your Doodle Market receipt — ${doodleTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="margin-bottom: 4px;">Thanks for your purchase, ${buyerUsername}!</h2>
        <p style="color: #888;">Here's your receipt from Doodle Market.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #555;">Doodle</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">${doodleTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #555;">Amount charged</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">$${price.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #555;">Remaining balance</td>
            <td style="padding: 8px 0; text-align: right;">$${remainingBalance.toFixed(2)}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #aaa; font-size: 0.85rem;">This is a demo application. No real money was charged.</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
};
