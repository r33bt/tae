const { Resend } = require('resend');

const resend = new Resend('re_6pFjTqpV_9ojs5Fo7fvqy2DKfv3HcqBEM');

async function test() {
  console.log('Testing with verified domain...');
  try {
    const result = await resend.emails.send({
      from: 'TAE Newsletter <newsletter@theagentengineer.com>',  // Your verified domain!
      to: '199pat@gmail.com',  // Now this should work
      subject: 'TAE Newsletter Verification',
      html: '<h2>Success!</h2><p>Your domain is working perfectly!</p>'
    });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();