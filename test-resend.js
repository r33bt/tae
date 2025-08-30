const { Resend } = require('resend');
const resend = new Resend('YOUR_RESEND_API_KEY_HERE');

async function testResend() {
  try {
    const result = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: '199pat@gmail.com',
      subject: 'Direct Resend Test',
      html: '<p>This is a direct test of Resend API</p>'
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testResend();