document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const typingIndicator = document.getElementById("typing-indicator");
  
    // 🔹 Initial greeting from the bot
    const initialMessage = document.createElement("div");
    initialMessage.className = "bot-message message";
    initialMessage.textContent = "Hi! I'm Seth. Feel free to ask me anything about On.";
    messagesContainer.appendChild(initialMessage);
  
    // 🔹 Scroll to bottom on load
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
    // 🔹 Function to display a message
    function displayMessage(message, isUser) {
      const messageElement = document.createElement("div");
      messageElement.className = `${isUser ? "user-message" : "bot-message"} message`;
      messageElement.textContent = message;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  
    // 🔹 Send message to the backend
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
  
      displayMessage(message, true);
      userInput.value = "";
      typingIndicator.style.display = "block";
  
      try {
        const response = await fetch("https://on-chatbot-backend.onrender.com/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
  
        const data = await response.json();
if (data.reply) {
  // ⏳ Wait 2.5 seconds to simulate longer typing
  await new Promise(resolve => setTimeout(resolve, 2500));
  displayMessage(data.reply, false);
}
 else {
          displayMessage("⚠️ Sorry, I didn't understand that.", false);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        displayMessage("⚠️ Error connecting to server.", false);
      } finally {
        typingIndicator.style.display = "none";
      }
    }
  
    // 🔹 Send button click
    sendButton.addEventListener("click", sendMessage);
  
    // 🔹 Pressing Enter on desktop and mobile
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  });
  