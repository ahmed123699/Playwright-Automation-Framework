import MailosaurClient from 'mailosaur';
export const serverId = process.env.mailosaurServerId;
export const domain = process.env.mailosaurDomain;

if (!process.env.mailosaurApiKey) {
    throw new Error("mailosaurApiKey is missing in process.env!");
}

export const mailosaur = new MailosaurClient(process.env.mailosaurApiKey);