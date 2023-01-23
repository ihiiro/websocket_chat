const ws = new WebSocket('ws://0.0.0.0:8080');

ws.addEventListener('open', () => {
  document.getElementById('send').addEventListener('click', () => {
    // convert object into json string so the data makes it in the correct format
    ws.send(JSON.stringify({
      sender: document.getElementById('sender').value,
      message: document.getElementById('message').value,
    }));
  });

  ws.addEventListener('message', data => {
    const message_object = JSON.parse(data.data);
    document.getElementById('chat-history').innerHTML += `<div class="chat-message">
      <span class="sender-username">${message_object.sender}:</span>
      <span class="message">${message_object.message}</span>
    </div>`
  });
});
