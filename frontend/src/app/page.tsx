"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Bot, Send, Check, Plus, Trash2, Sparkles, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interfaces for TypeScript safety
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your 3D Task Master. How can I help you manage your tasks today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const BACKEND_API_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, todos]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate API call for demo purposes
      // In a real app, uncomment the following code:
      /*
      const response = await fetch(`${BACKEND_API_URL}/api/user123/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      */

      // For demo, simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process todo commands
      let botResponse = "";
      if (input.toLowerCase().includes("add") || input.toLowerCase().includes("create")) {
        const todoText = input.replace(/(add|create|task)/gi, "").trim();
        if (todoText) {
          const newTodo: TodoItem = {
            id: Date.now().toString(),
            text: todoText,
            completed: false,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          setTodos(prev => [...prev, newTodo]);
          botResponse = `Added "${todoText}" to your tasks!`;
        } else {
          botResponse = "What task would you like to add?";
        }
      } else if (input.toLowerCase().includes("complete") || input.toLowerCase().includes("done")) {
        const todoIndex = parseInt(input.match(/\d+/)?.[0] || "") - 1;
        if (!isNaN(todoIndex) && todoIndex >= 0 && todoIndex < todos.length) {
          const updatedTodos = [...todos];
          updatedTodos[todoIndex].completed = true;
          setTodos(updatedTodos);
          botResponse = `Marked "${updatedTodos[todoIndex].text}" as completed!`;
        } else {
          botResponse = "Which task would you like to mark as completed? Please specify the task number.";
        }
      } else if (input.toLowerCase().includes("delete") || input.toLowerCase().includes("remove")) {
        const todoIndex = parseInt(input.match(/\d+/)?.[0] || "") - 1;
        if (!isNaN(todoIndex) && todoIndex >= 0 && todoIndex < todos.length) {
          const deletedTodo = todos[todoIndex];
          setTodos(prev => prev.filter((_, i) => i !== todoIndex));
          botResponse = `Deleted "${deletedTodo.text}" from your tasks.`;
        } else {
          botResponse = "Which task would you like to delete? Please specify the task number.";
        }
      } else if (input.toLowerCase().includes("list") || input.toLowerCase().includes("show")) {
        if (todos.length === 0) {
          botResponse = "You have no tasks yet. Add some tasks!";
        } else {
          botResponse = `You have ${todos.length} tasks:\n${todos.map((todo, index) => `${index + 1}. ${todo.text} - ${todo.completed ? '✓ Completed' : '○ Pending'}`).join('\n')}`;
        }
      } else {
        botResponse = `I understood: "${input}". You can ask me to add, complete, delete, or list your tasks!`;
      }

      const botMessage: Message = {
        role: "assistant",
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "System Error: Unable to process your request. Try again.",
        timestamp: currentTime,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Animated blobs in background */}
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>

      <div className="chat-container flex h-screen relative z-10">
        {/* Sidebar - Recent Tasks */}
        <aside className="w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 hidden lg:flex flex-col p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl border border-white/20 shadow-lg shadow-pink-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                My Tasks
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <AnimatePresence>
              {todos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`todo-item p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20 flex items-center gap-3 group ${
                    todo.completed ? 'opacity-70' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400'
                        : 'border-white/40 hover:border-white/70'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-white font-medium ${todo.completed ? 'line-through' : ''}`}>
                      {todo.text}
                    </p>
                    <p className="text-xs text-white/60 mt-1">{todo.createdAt}</p>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {todos.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-block p-4 bg-white/10 rounded-2xl border border-white/20">
                  <p className="text-white/60">No tasks yet</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/20">
            <div className="p-4 bg-gradient-to-r from-pink-500/20 to-blue-500/20 backdrop-blur rounded-2xl border border-white/20">
              <p className="text-sm text-white/80">Tasks: {todos.length}</p>
              <p className="text-xs text-white/60 mt-1">Completed: {todos.filter(t => t.completed).length}</p>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
          {/* Top Header */}
          <header className="h-16 border-b border-white/20 bg-white/10 backdrop-blur-xl flex items-center px-8 justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                3D Task Master
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Online</span>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.length === 0 && todos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-lg shadow-pink-500/20">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to 3D Task Master
                </h3>
                <p className="text-white/70 max-w-sm">
                  Ask me to create, manage, or track your tasks. Try: "Add a task to call John at 3 PM"
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] chat-card ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl rounded-br-none p-4 shadow-lg shadow-pink-500/30"
                            : "bg-white/10 backdrop-blur border border-white/20 text-white rounded-2xl rounded-bl-none p-4 shadow-lg"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.role === "user" ? "text-pink-200" : "text-white/50"
                          } ${msg.role === "user" ? "text-right" : "text-left"}`}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="chat-card bg-white/10 backdrop-blur p-4 rounded-2xl rounded-bl-none border border-white/20 flex gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      <span className="text-xs text-white/60 ml-2">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Wrapper */}
          <div className="p-6 bg-gradient-to-t from-white/10 via-transparent backdrop-blur">
            <form
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto relative"
            >
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI to manage your tasks... (e.g. 'Add buy groceries')"
                  className="w-full bg-white/10 backdrop-blur border border-white/20 text-white pl-6 pr-16 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-lg shadow-pink-500/10 placeholder:text-white/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="three-d-button absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 disabled:shadow-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-xs text-center text-white/50 mt-3 uppercase tracking-tighter">
              3D Task Master • AI-Powered Todo Assistant
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}