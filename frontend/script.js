let formEl = document.getElementById("send-message");
let userEl = document.getElementById("user");
let messageEl = document.getElementById("message");
let displayBox = document.getElementById("display-message");
let feedbackEl = document.getElementById("feedback");

const url = `http://127.0.0.1:3000/messages`;

async function displayMessages() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const result = await response.json();

    if (result.length === 0) {
      displayBox.innerHTML = `
        <p>No messages to display.</p>
        `;
      return;
    }
    displayBox.innerHTML = result
      .map(
        (msg) =>
          `<div>
            <p>
                <strong>${msg.user}: ${msg.message} </strong>
                <small>${new Date(msg.time).toLocaleString()}</small>
            </p>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error(error.message);
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  let message = messageEl.value;
  let user = userEl.value;

  if (!message || !user) {
    feedbackEl.innerHTML = `<p>Field cannot be empty!</p>`;
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, message }),
    });

    if (!response.ok) {
      feedbackEl.innerHTML = `<p>${await response.text()}</p>`;
      return;
    }

    feedbackEl.innerHTML = `<p>Message sent!</p>`;

    setTimeout(() => {
      feedbackEl.innerHTML = "";
    }, 3000);

    userEl.value = ""; //Clear user for same browser, but diff browsers for users ? leave the username foreach user's browser
    messageEl.value = "";

    displayMessages();
  } catch (error) {
    console.error(error.message);
    feedbackEl.innerHTML = `<p>Something went wrong.</p>`;
  }
}

formEl.addEventListener("submit", handleSubmit);

displayMessages();
