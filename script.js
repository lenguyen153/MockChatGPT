const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-button");
const themedButton = document.querySelector("#theme-button");
const deleteButton = document.querySelector("#delete-button");
const chatContainer = document.querySelector(".chat-container")

const API_KEY = API_KEY1;
const initialHeight = chatInput.scrollHeight;
let userText = null;

// Load data saved in the local storage (theme, chat history)
const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themedButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText =
        `<div class="default-text">
            <h1>Mock ChatGPT </h1>
            <p>Start a conversation and explore the power of AI.</p>
        </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

// Send POST request through OpenAI API
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
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retireving the response. Please try again later!"
    }

    // Remove typing animation, append the pararagraph element, save chat to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

// Copy the response from chatGPT to the clipboard
const copyResponse = (copyButton) => {
    const responseTextElement = copyButton.parentElement.querySelector("p");
    const responseText = responseTextElement.textContent; // Get the text content
    navigator.clipboard.writeText(responseText);
    // console.log(responseText)
    copyButton.textContent = "done";
    setTimeout(() => copyButton.textContent = "content_copy", 1000);
}

// Show the dotting animation and give the response from the user prompt
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
            <span onclick="copyResponse(this)" class="material-symbols-outlined">content_copy</span>
        </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv); // Send POST request to OpenAI API
}

// Handle user prompt
const handleOutgoingChat = () => {
    // Create a new div and apply chat, specified class and set html content of div
    userText = chatInput.value.trim();
    // to avoid HTML format in the text
    if (!userText) return

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;
    
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
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themedButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themedButton.innerText);
    themedButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

// Remove all chat
deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleOutgoingChat();
    }
})

sendButton.addEventListener("click", handleOutgoingChat);