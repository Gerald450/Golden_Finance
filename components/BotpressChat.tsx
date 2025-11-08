"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    botpress?: Record<string, unknown>;
  }
}

export default function BotpressChat() {
  useEffect(() => {
    const loadBotpress = async () => {
      try {
        // Check if already loaded
        if (window.botpress) {
          return;
        }

        // Load main Botpress script first
        await new Promise<void>((resolve, reject) => {
          const script1 = document.createElement("script");
          script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
          script1.onload = () => resolve();
          script1.onerror = () => reject(new Error("Failed to load Botpress inject script"));
          document.head.appendChild(script1);
        });

        // Wait a bit for botpress to initialize
        await new Promise(resolve => setTimeout(resolve, 500));

        // Load configuration script
        await new Promise<void>((resolve, reject) => {
          const script2 = document.createElement("script");
          script2.src = "https://files.bpcontent.cloud/2025/11/07/23/20251107235946-2LWNA2FC.js";
          script2.onload = () => resolve();
          script2.onerror = () => reject(new Error("Failed to load Botpress config script"));
          document.head.appendChild(script2);
        });

        console.log("Botpress loaded successfully");
      } catch (error) {
        console.error("Error loading Botpress:", error);
      }
    };

    loadBotpress();
  }, []);

  return null;
}