const micBtn = document.getElementById('mic-btn');
const status = document.getElementById('status');
const log = document.getElementById('log');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

micBtn.onclick = () => {
  recognition.start();
  status.innerText = "Listening...";
};

recognition.onresult = (event) => {
  const command = event.results[0][0].transcript.toLowerCase();
  status.innerText = `You said: "${command}"`;
  log.innerText = '';
  let path = '';

  if (command.includes("turn on fan")) {
    path = "/on";
    speak("Okay. Turning fan on.");
  } else if (command.includes("turn off fan")) {
    path = "/off";
    speak("Okay. Turning fan off.");
  } else if (command.includes("hello robot")) {
    speak("Hello user");
    status.innerText = "Greeting received.";
    return;
  } else {
    speak("Command not recognized.");
    status.innerText = "Command not recognized.";
    return;
  }

  // Send HTTP GET request to ESP8266
  fetch(path)
    .then(response => response.text())
    .then(data => {
      log.innerText = data;
      if (path === "/on") {
        speak("Fan is on");
      } else if (path === "/off") {
        speak("Fan is off");
      }
    })
    .catch(error => {
      console.error(error);
      status.innerText = "Error sending command.";
    });
};

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
