# Showcase consuming events from square API

```bash
cp .env.example .env #update signatue key with the key defined in square
yarn
ngrok http 4242 #can inspect requests at http://127.0.0.1:4040/inspect/http
#update ngrok endpoint in .env
node index.js
```
Update webhook url in square with `ngrok` endpoint and send in a test event


## References

- [webhooks overview](https://developer.squareup.com/docs/webhooks-overview)
- [serverless for webhooks](https://medium.com/square-corner-blog/stop-using-servers-to-handle-webhooks-675d5dc926c0)
