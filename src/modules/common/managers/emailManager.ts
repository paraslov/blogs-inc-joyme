import { emailService, mailTemplatesService } from '../services'

export const emailManager = {
  async sendRegistrationEmail(email: string) {
    const emailTemplate = mailTemplatesService.getRegistrationMailTemplate(email)

    return await emailService.sendEmail(emailTemplate)
  },
}
