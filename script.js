const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-button");
const chatContainer = document.querySelector(".chat-container")

let userText = null;

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const handleOutgoingChat = () => {
    // Create a new div and apply chat, specified class and set html content of div
    userText = chatInput.value.trim();
    // console.log(userText);
    const html =
        `<div class="chat-content">
            <div class="chat-details">
                <img src="images/user.png" alt="user-img">
                <p>${userText}</p>
            </div>
        </div>`;
        const outgoingChatDiv = createElement(html, "outgoing");
        console.log(outgoingChatDiv);
        chatContainer.appendChild(outgoingChatDiv);
}

sendButton.addEventListener("click", handleOutgoingChat);