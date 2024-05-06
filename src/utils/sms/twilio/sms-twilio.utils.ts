import twilio from 'twilio';

const accountSid = 'AC5e4f9cdae36410392cfd4daa0d713a69';
const authToken = '471350cc566ebf5447872fd23af731cb';
const client = twilio(accountSid, authToken);

async function SmsTwilio(): Promise<void> {
  try {
    const message = await client.messages.create({
      body: 'This is code for verification',
      from: '+12176353724', 
      to: '+5511949163426', 
    });

    console.log(message.sid);
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
  }
}

export { SmsTwilio };
