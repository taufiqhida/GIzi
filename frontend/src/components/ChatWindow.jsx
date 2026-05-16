import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Send, Wifi, WifiOff } from 'lucide-react';

const ChatWindow = ({ konsultasi, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Get WebSocket URL
  const getWsUrl = useCallback(() => {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
    const wsProtocol = backendUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = backendUrl.replace(/^https?:\/\//, '');
    return `${wsProtocol}://${wsHost}/ws/chat/${konsultasi.id}?token=${token}`;
  }, [konsultasi.id]);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    try {
      const res = await chatAPI.getMessages(konsultasi.id);
      setMessages(res.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Load messages error:', error);
    }
  }, [konsultasi.id]);

  // Connect WebSocket (only on konsultasi.id change)
  useEffect(() => {
    loadMessages();

    const connectWs = () => {
      try {
        const ws = new WebSocket(getWsUrl());

        ws.onopen = () => {
          setConnected(true);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'new_message') {
            setMessages(prev => {
              const exists = prev.some(m => m.id === data.data.id);
              if (exists) return prev;
              return [...prev, data.data];
            });
          }
        };

        ws.onclose = () => {
          setConnected(false);
          // Reconnect after 3 seconds
          setTimeout(connectWs, 3000);
        };

        ws.onerror = () => {
          setConnected(false);
        };

        wsRef.current = ws;
      } catch (error) {
        setConnected(false);
      }
    };

    connectWs();

    // Fallback polling if WebSocket fails
    const pollInterval = setInterval(() => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        loadMessages();
      }
    }, 5000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [konsultasi.id, getWsUrl, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      // Send via REST API (more reliable)
      await chatAPI.sendMessage({
        konsultasi_id: konsultasi.id,
        message: newMessage
      });
      setNewMessage('');
      
      // If WebSocket not connected, reload messages
      if (!connected) {
        loadMessages();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft size={20} />
              </Button>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  Chat Konsultasi
                  {connected ? (
                    <Wifi size={16} className="text-green-500" />
                  ) : (
                    <WifiOff size={16} className="text-gray-400" />
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600">#{konsultasi.id.slice(0, 8)}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  Belum ada pesan. Mulai percakapan!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMine 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="text-xs opacity-75 mb-1">
                          {msg.sender_name || (msg.sender_role === 'dokter' ? 'Dokter' : 'Pasien')}
                          {msg.sender_role === 'dokter' && ' 👨‍⚕️'}
                        </div>
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSend} className="flex space-x-2">
                <Input
                  placeholder="Tulis pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={sending || !newMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatWindow;
