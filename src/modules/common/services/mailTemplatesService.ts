export const mailTemplatesService = {
  getRegistrationMailTemplate(userEmail: string) {
    return {
      from: '"JoyMe Studios" <joymestudios@gmail.com>',
      to: userEmail,
      subject: 'Verify your registration on "Blogs inc. JoyMe"',
      html: `<h1>Thanks for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
             </p>`,
    };
  }
}
