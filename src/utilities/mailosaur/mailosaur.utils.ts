import { ReplyFromMailosureData, SendEmailData } from '@interfaces/mailosaur.interface';
import { MessageCreateOptions } from 'mailosaur/lib/models';
import { Message } from 'mailosaur/lib/models'; // Importing Message type
import { mailosaur, serverId } from './mailosaur.settings';

// Function to send email with/ without attachment
export const sendEmail = async (sendEmailData: SendEmailData): Promise<Message> => {
  if (!serverId) {
    throw new Error('Mailosaur server ID is not defined.');
  }

  // Prepare message options, making the attachment optional
  const messageOptions: MessageCreateOptions = {
    // attachments: sendEmailData.attachment || undefined, // If attachment is not provided, it will be undefined
    from: sendEmailData.from,
    html: sendEmailData.htmlContent,
    send: true,
    subject: sendEmailData.subject,
    text: sendEmailData.textContent,
    to: sendEmailData.to,
  };

  // Creating and returning the email message
  const response = await mailosaur.messages.create(serverId, messageOptions);
  return response;
};

// Function to get email by recipient email address
export const getEmailByRecipient = async (recipientEmail: string, timeout: number = 60000): Promise<Message> => {
  if (!serverId) {
    throw new Error('Mailosaur server ID is not defined.');
  }

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const email = await mailosaur.messages.get(serverId, {
        sentTo: recipientEmail,
      });

      if (email) {
        return email;
      }
    } catch (error) {
      console.error(`Error while fetching email for recipient ${recipientEmail}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry every second
  }

  throw new Error(`Timeout exceeded while waiting for email sent to ${recipientEmail}.`);
};

// Function to get email ID by recipient email address
export const getEmailIdByRecipient = async (recipientEmail: string, timeout: number = 60000): Promise<string> => {
  try {
    const email = await getEmailByRecipient(recipientEmail, timeout);

    if (!email.id) {
      throw new Error(`No email found for recipient ${recipientEmail}.`);
    }

    // Return the email ID
    return email.id;
  } catch (error) {
    throw new Error(`Error fetching email ID for recipient ${recipientEmail}: ${error.message}`);
  }
};

// Function to reply to email (uses getEmailIdByRecipient)
export const replyToEmail = async (
  recipientEmail: string,
  replyFromMailosureData: ReplyFromMailosureData,
): Promise<void> => {
  if (!serverId) {
    throw new Error('Mailosaur server ID is not defined.');
  }

  try {
    const emailId = await getEmailIdByRecipient(recipientEmail);

    const messageOptions = {
      html: replyFromMailosureData.htmlContent,
      text: replyFromMailosureData.textContent,
    };

    await mailosaur.messages.reply(emailId, messageOptions);
  } catch (error) {
    throw new Error(`Error replying to email: ${error.message}`);
  }
  await mailosaur.messages.deleteAll("bpnmvjmz");

};
