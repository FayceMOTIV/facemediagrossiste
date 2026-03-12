'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  MoreVertical,
  Paperclip,
  Image,
  Smile,
  Check,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { subscribeToCollection, COLLECTIONS } from '@/services/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: Date | string | null;
  unreadCount: number;
  type?: 'client' | 'livreur' | 'equipe';
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: Date | string | null;
  read: boolean;
}

function getTypeColor(type: Conversation['type']): string {
  switch (type) {
    case 'client': return 'bg-orange-100 text-orange-800';
    case 'livreur': return 'bg-green-100 text-green-800';
    case 'equipe': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getTypeLabel(type: Conversation['type']): string {
  switch (type) {
    case 'client': return 'Client';
    case 'livreur': return 'Livreur';
    case 'equipe': return 'Équipe';
    default: return 'Contact';
  }
}

function formatMessageTime(sentAt: Date | string | null): string {
  if (!sentAt) return '';
  try {
    const date = sentAt instanceof Date ? sentAt : new Date(sentAt);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to conversations
  useEffect(() => {
    const unsubscribe = subscribeToCollection<Conversation>(
      'conversations',
      (data) => {
        setConversations(data);
        setLoadingConversations(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    setLoadingMessages(true);
    const unsubscribe = subscribeToCollection<ChatMessage>(
      'messages',
      (data) => {
        const sorted = [...data].sort((a, b) => {
          const aTime = a.sentAt instanceof Date ? a.sentAt.getTime() : a.sentAt ? new Date(a.sentAt).getTime() : 0;
          const bTime = b.sentAt instanceof Date ? b.sentAt.getTime() : b.sentAt ? new Date(b.sentAt).getTime() : 0;
          return aTime - bTime;
        });
        setMessages(sorted);
        setLoadingMessages(false);
      },
      [{ field: 'conversationId', operator: '==', value: selectedConversation.id }]
    );
    return () => unsubscribe();
  }, [selectedConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConversation || !user) return;
    const content = messageInput.trim();
    setMessageInput('');

    // Optimistic UI — add message locally
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.uid,
      senderName: user.displayName ?? user.email ?? 'Moi',
      content,
      sentAt: new Date(),
      read: false,
    };
    setMessages((prev) => [...prev, optimisticMessage]);
  };

  const filteredConversations = conversations.filter((c) => {
    const name = c.participantNames?.join(' ') ?? '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getConversationDisplayName = (conv: Conversation): string => {
    if (!user) return conv.participantNames?.[0] ?? 'Inconnu';
    const others = conv.participantNames?.filter((_, i) => conv.participantIds?.[i] !== user.uid);
    return others?.[0] ?? conv.participantNames?.[0] ?? 'Inconnu';
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Messagerie"
        subtitle="Communiquez avec clients, livreurs et équipe"
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Contacts list */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {loadingConversations ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-gray-500 px-4">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-sm">Aucune conversation</p>
                  <p className="text-xs mt-1">Les conversations apparaîtront ici</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conv) => {
                    const displayName = getConversationDisplayName(conv);
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="font-bold text-gray-600 text-sm">
                                {getInitials(displayName)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900 truncate text-sm">{displayName}</p>
                              {conv.lastMessageAt && (
                                <span className="text-xs text-gray-500">
                                  {formatMessageTime(conv.lastMessageAt)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                              {conv.unreadCount > 0 && (
                                <span className="ml-2 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            {conv.type && (
                              <Badge className={`mt-1 text-xs ${getTypeColor(conv.type)}`}>
                                {getTypeLabel(conv.type)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="border-b py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-bold text-gray-600 text-sm">
                          {getInitials(getConversationDisplayName(selectedConversation))}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getConversationDisplayName(selectedConversation)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Aucun message dans cette conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = user ? message.senderId === user.uid : false;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              isMine
                                ? 'bg-orange-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 ${
                                isMine ? 'text-orange-200' : 'text-gray-400'
                              }`}
                            >
                              <span className="text-xs">{formatMessageTime(message.sentAt)}</span>
                              {isMine && (
                                message.read ? (
                                  <CheckCheck className="w-4 h-4" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="border-t p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Button type="button" variant="ghost" size="sm">
                      <Paperclip className="w-5 h-5 text-gray-500" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <Image className="w-5 h-5 text-gray-500" />
                    </Button>
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="sm">
                      <Smile className="w-5 h-5 text-gray-500" />
                    </Button>
                    <Button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Sélectionnez une conversation</p>
                  <p className="text-sm">Choisissez un contact pour démarrer</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
