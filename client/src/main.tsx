import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import fonts
const fontsLink = document.createElement("link");
fontsLink.rel = "stylesheet";
fontsLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontsLink);

// Add title
const titleElement = document.createElement("title");
titleElement.textContent = "Dream AI Visualizer";
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);
