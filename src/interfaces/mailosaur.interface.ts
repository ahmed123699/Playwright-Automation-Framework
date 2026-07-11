export interface SendEmailData {
  attachment?: { content: string; fileName: string };
  from: string;
  htmlContent?: string;
  subject: string;
  textContent?: string;
  to: string;
}

export interface ReplyFromMailosureData {
  htmlContent?: string;
  textContent?: string;
}
