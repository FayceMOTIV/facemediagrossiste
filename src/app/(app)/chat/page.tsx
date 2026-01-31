'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Circle
} from 'lucide-react';

interface Contact {
  id: string;
  nom: string;
  type: 'client' | 'livreur' | 'equipe';
  dernierMessage: string;
  heure: string;
  nonLus: number;
  online: boolean;
}

interface Message {
  id: string;
  contenu: string;
  heure: string;
  envoyeur: 'moi' | 'autre';
  lu: boolean;
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    { id: '1', nom: "O'Tacos Lyon 7", type: 'client', dernierMessage: 'Parfait, à demain pour la livraison !', heure: '10:45', nonLus: 0, online: true },
    { id: '2', nom: 'Ahmed D. (Livreur)', type: 'livreur', dernierMessage: "Je suis en route vers Pizza Napoli", heure: '10:30', nonLus: 2, online: true },
    { id: '3', nom: 'Mohamed K.', type: 'equipe', dernierMessage: 'RDV confirmé avec Burger Factory', heure: '09:15', nonLus: 0, online: false },
    { id: '4', nom: 'Istanbul Kebab', type: 'client', dernierMessage: 'Pouvez-vous livrer plus tôt ?', heure: 'Hier', nonLus: 1, online: false },
    { id: '5', nom: 'Karim S. (Livreur)', type: 'livreur', dernierMessage: 'Tournée terminée !', heure: 'Hier', nonLus: 0, online: true },
    { id: '6', nom: 'Pizza Napoli', type: 'client', dernierMessage: 'Merci pour le devis', heure: 'Lun', nonLus: 0, online: false },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', contenu: "Bonjour, je voudrais passer commande pour demain", heure: '10:00', envoyeur: 'autre', lu: true },
    { id: '2', contenu: "Bonjour ! Bien sûr, qu'est-ce qu'il vous faut ?", heure: '10:02', envoyeur: 'moi', lu: true },
    { id: '3', contenu: "3 broches de kebab 10kg et 200 pains pita", heure: '10:05', envoyeur: 'autre', lu: true },
    { id: '4', contenu: "Noté ! Livraison prévue demain avant 11h. Le total est de 375€ HT.", heure: '10:08', envoyeur: 'moi', lu: true },
    { id: '5', contenu: "Parfait, à demain pour la livraison !", heure: '10:45', envoyeur: 'autre', lu: true },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      contenu: messageInput,
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      envoyeur: 'moi',
      lu: false
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const filteredContacts = contacts.filter(c =>
    c.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: Contact['type']) => {
    switch (type) {
      case 'client': return 'bg-orange-100 text-orange-800';
      case 'livreur': return 'bg-green-100 text-green-800';
      case 'equipe': return 'bg-blue-100 text-blue-800';
    }
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
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-bold text-gray-600">
                            {contact.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate">{contact.nom}</p>
                          <span className="text-xs text-gray-500">{contact.heure}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">{contact.dernierMessage}</p>
                          {contact.nonLus > 0 && (
                            <span className="ml-2 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center">
                              {contact.nonLus}
                            </span>
                          )}
                        </div>
                        <Badge className={`mt-1 text-xs ${getTypeColor(contact.type)}`}>
                          {contact.type === 'client' ? 'Client' : contact.type === 'livreur' ? 'Livreur' : 'Équipe'}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat header */}
                <CardHeader className="border-b py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-bold text-gray-600">
                            {selectedContact.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        {selectedContact.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedContact.nom}</p>
                        <p className="text-xs text-gray-500">
                          {selectedContact.online ? 'En ligne' : 'Hors ligne'}
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
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.envoyeur === 'moi' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          message.envoyeur === 'moi'
                            ? 'bg-orange-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.contenu}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          message.envoyeur === 'moi' ? 'text-orange-200' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">{message.heure}</span>
                          {message.envoyeur === 'moi' && (
                            message.lu ? (
                              <CheckCheck className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
