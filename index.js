
require('dotenv').config()
const express = require('express')
const app = express()

// Parse HTTP bodies as JSON
app.use(express.json())

// The crypto module provides cryptographic functionality
const crypto = require('crypto')

function isValidSignature(body, url, signature) {
  // Concatenate your notification URL and
  // the JSON body of the webhook notification
  const combined = url + body

  // Webhook subscription signature key defined in dev portal for app
  // webhook listener endpoint: https://webhook.site/my-listener-endpoint
  // Note: Signature key is truncated for illustration
  const signatureKey = process.env.SIG_KEY

  // Generate the HMAC-SHA1 signature of the string
  // signed with your webhook signature key
  const hmac = crypto.createHmac('sha1', signatureKey)
  hmac.write(combined)
  hmac.end()
  const checkHash = hmac.read().toString('base64')
  console.log("isValidSignature -> checkHash", checkHash)

  // Compare HMAC-SHA1 signatures.
  if (checkHash === signature) {
    console.log('Validation success!')
  } else {
    console.log('Validation error.')
  }
}

app.post(
  '/webhook',
  (request, response) => {
    const signature = request.header('x-square-signature')
    console.log("signature", signature)
    console.log(request.headers);

    if (request.header('Square-Environment') === 'Sandbox') {
      console.log('Sandbox webhook notification received')
    }
    let event
    try {
      const body = JSON.stringify(request.body)

      event = request.body
      console.log('event', JSON.stringify(event))
      isValidSignature(body, process.env.WEBHOOK_URL, signature)
    } catch (err) {
      console.log(`⚠️  Webhook error while parsing basic request.`, err.message)
      return response.send()
    }

    // Handle the event
    switch (event.type) {
      case 'order.created':
        const order = event.data.object
        console.log(`order for ${order.order_created.location_id} was created!`)
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`)
    }

    // Return a 200 response to acknowledge receipt of the event
    response.sendStatus(200)
  }
)

app.listen(4242, () => console.log('Running on port 4242'))
