'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  User,
  Bot,
  Lightbulb,
  TrendingUp,
  ShoppingCart,
  Users,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AssistantPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/assistant',
      body: {
        userId: user?.uid,
        clientContext: {},
      },
    }),
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput('');
    await sendMessage({ text });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleQuickAction = async (query: string) => {
    if (isStreaming) return;
    await sendMessage({ text: query });
  };

  const quickActions = [
    {
      icon: TrendingUp,
      label: 'Analyse ventes',
      query: 'Analyse mon portefeuille',
    },
    {
      icon: Users,
      label: 'Nouveau client',
      query: 'Comment convaincre un nouveau client ?',
    },
    {
      icon: ShoppingCart,
      label: 'Cross-selling',
      query: 'Stratégie de cross-selling',
    },
    {
      icon: HelpCircle,
      label: 'Objections',
      query: "Comment répondre à \"c'est trop cher\" ?",
    },
  ];

  // Initial suggestions shown before any messages
  const initialSuggestions = [
    'Comment convaincre un nouveau client ?',
    'Quels arguments pour les broches kebab ?',
    "Comment répondre à \"c'est trop cher\" ?",
    'Analyse de mon portefeuille',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="IA Assistant Commercial"
        subtitle="Votre coach de vente personnel propulsé par l'IA"
      />

      <div className="flex-1 p-6 flex flex-col max-w-4xl mx-auto w-full">
        {/* Hero */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">
                  Assistant Commercial IA
                </h2>
                <p className="text-indigo-100">
                  Conseils de vente, argumentaires, réponses aux objections - en
                  temps réel
                </p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">+20% conversion</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              className="h-auto py-3 flex flex-col gap-2"
              onClick={() => handleQuickAction(action.query)}
              disabled={isStreaming}
            >
              <action.icon className="w-5 h-5 text-indigo-600" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Chat */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="w-5 h-5 text-indigo-600" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
              {/* Welcome message when no messages yet */}
              {messages.length === 0 && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <p className="whitespace-pre-wrap text-sm">
                        {`Bonjour ! Je suis votre assistant commercial IA. Je peux vous aider avec :

• Conseils de vente personnalisés
• Réponses aux objections clients
• Argumentaires produits
• Stratégies de négociation
• Analyse de votre portefeuille

Que puis-je faire pour vous ?`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {initialSuggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actual messages */}
              {messages.map((message) => {
                const textContent = message.parts
                  .filter((p) => p.type === 'text')
                  .map((p) => (p as { type: 'text'; text: string }).text)
                  .join('');

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">
                          {textContent}
                        </p>
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Streaming indicator */}
              {isStreaming && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div className="flex gap-3">
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    Une erreur est survenue. Veuillez réessayer.
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1"
                  disabled={isStreaming}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Conseils du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Meilleur moment d'appel",
                  tip: 'Les mardis et jeudis entre 10h-11h30 ont le meilleur taux de réponse',
                },
                {
                  title: 'Produit star',
                  tip: "La broche 10kg à 75€ est votre meilleur argument prix",
                },
                {
                  title: 'Objection fréquente',
                  tip: "45% des prospects mentionnent le prix - préparez votre argumentaire valeur",
                },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600">{item.tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
