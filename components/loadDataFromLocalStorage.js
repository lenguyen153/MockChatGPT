import React, { useEffect } from 'react';

const loadDataFromLocalStorage = () => {
    useEffect(() => {
        // Function to load data from local storage
        const loadChatData = () => {
            // Retrieve theme color from local storage
            const themeColor = localStorage.getItem("theme-color");
            document.body.classList.toggle("light-mode", themeColor === "light_mode");

            // Toggle themed button text based on theme color
            const themedButton = document.querySelector("#theme-button");
            themedButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

            // Default text for chat container
            const defaultText = `
                <div class="default-text">
                    <h1>Mock ChatGPT </h1>
                    <p>Start a conversation and explore the power of AI.</p>
                </div>
            `;
            
            // Get chat container and set its content from local storage or default text
            const chatContainer = document.querySelector(".chat-container");
            chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
        };

        // Call the loadChatData function when the component mounts
        loadChatData();
    }, []); // Empty dependency array ensures this effect only runs once after initial render
};

export default loadDataFromLocalStorage;