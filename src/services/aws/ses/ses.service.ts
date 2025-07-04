import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const sesClient = new SESClient({
    region: process.env.AWS_REGION
});

const sendEmail = async (to: string, subject: string, htmlBody: string) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: process.env.AWS_SES_VERIFIED_EMAIL!, // Must be verified in SES
  });

  return await sesClient.send(command);
};

export const SESService = {
    sendEmail
}