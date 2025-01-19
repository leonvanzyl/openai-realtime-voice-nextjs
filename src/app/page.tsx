"use client";

import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import Image from "next/image";

export default function Home() {
  const {
    isConnected,
    isConnecting,
    error,
    transcript,
    connect,
    disconnect,
    sendMessage,
  } = useChat();

  const startConversation = useCallback(() => {
    connect();
    // Start the conversation with initial instructions
    sendMessage({
      type: "response.create",
      response: {
        modalities: ["text"],
        instructions:
          "You are a helpful AI assistant. Let's have a conversation.",
      },
    });
  }, [connect, sendMessage]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <div className="relative">
        <div
          className={`absolute w-32 h-32 rounded-full blur-xl transition-opacity ${
            isConnected
              ? "animate-pulse bg-blue-400/50 opacity-100"
              : "opacity-0"
          }`}
          style={{ transform: "scale(1.2)", left: "-16%", top: "-16%" }}
        />
        <div className="rounded-full overflow-hidden w-32 h-32 mb-4 relative">
          <Image
            src="/avatar.webp"
            alt="AI Assistant Avatar"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-8">OpenAI Realtime API</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {!isConnected ? (
          <Button onClick={startConversation} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Start Conversation"}
          </Button>
        ) : (
          <Button onClick={disconnect} variant="destructive">
            End Conversation
          </Button>
        )}
      </div>

      {isConnected && (
        <>
          <div className="text-center mt-4">
            <p className="text-green-600">Connected! Start speaking...</p>
            <p className="text-sm text-gray-500 mt-2">
              The AI will respond to your voice in real-time
            </p>
          </div>

          {transcript && (
            <div className="mt-8 max-w-2xl w-full">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-2">Transcript:</h2>
                <p className="whitespace-pre-wrap">{transcript}</p>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
