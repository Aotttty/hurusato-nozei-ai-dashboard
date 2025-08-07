'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

export function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* チャットボットボタン */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          data-testid="chatbot-toggle-button"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* チャットボットポップアップ */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden" data-testid="chatbot-popup">
          {/* ヘッダー */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">AI アシスタント</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-white hover:bg-blue-700 p-1"
                data-testid="chatbot-minimize-button"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-blue-700 p-1"
                data-testid="chatbot-close-button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* チャットボットコンテンツ */}
          {!isMinimized && (
            <div className="w-96 h-[600px]">
              <iframe
                src="https://udify.app/chatbot/emfaGOE4tbh5EZoN"
                style={{ width: '100%', height: '100%', minHeight: '600px' }}
                frameBorder="0"
                allow="microphone"
                data-testid="chatbot-iframe"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 