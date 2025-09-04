"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import { useChat } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

const page = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="flex">
      <SimpleEditor />

      <div className="flex flex-1/3 flex-col w-full max-w-md py-8 mx-auto stretch border-l border-l-gray-300">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message
                from={message.role}
                key={message.id}
                className="whitespace-pre-wrap"
              >
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text": // we don't use any reasoning or tool calls in this example
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full mx-auto h-16 px-4 rounded-full border border-gray-400 flex justify-between items-center"
          >
            <input
              value={input}
              placeholder="Ask anything"
              onChange={(e) => setInput(e.currentTarget.value)}
              className="outline-none"
            />
            <button
              type="submit"
              data-status={status === "streaming" ? "streaming" : "ready"}
              disabled={!input.trim()}
              className=" flex items-center justify-center border rounded-full bg-black border-black cursor-pointer hover:size-7"
            >
              <ArrowUp className="text-white size-5" />
            </button>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default page;
