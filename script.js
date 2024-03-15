const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-button");
const chatContainer = document.querySelector(".chat-container")

let userText = null;
const API_KEY = "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"

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const pElement = document.createElement("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userText }],
            max_tokens: 2048,
            n: 1,
            stop: null
        })
    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        // console.log(response);
        pElement.textContent = response.choices[0].message.content.trim();
    } catch (error) {
        console.log(error);
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
}

const showTypingAnimation = () => {
    const html =
        `<div class="chat-content">
            <div class="chat-details">
                <img src="images/ChatGPT.png" alt="chatbot-img">
                <div class="typing-animation">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            <span class="material-symbols-outlined">content_copy</span>
        </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    // console.log(outgoingChatDiv);
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    // Create a new div and apply chat, specified class and set html content of div
    userText = chatInput.value.trim();
    // to avoid HTML format in the text
    if(!userText) return 
    // console.log(userText);
    const html =
        `<div class="chat-content">
            <div class="chat-details">
                <img src="images/user.png" alt="user-img">
                <p></p>
            </div>
        </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    // console.log(outgoingChatDiv);
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
}

sendButton.addEventListener("click", handleOutgoingChat);