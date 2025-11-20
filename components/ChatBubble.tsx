import React from 'react';

interface ChatBubbleProps {
  text: string;
  visible: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, visible }) => {
  if (!visible || !text) return null;

  return (
    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white text-black border-4 border-gray-800 p-3 rounded-lg shadow-lg max-w-[200px] z-10">
      <p className="font-pixel text-xs sm:text-sm text-center leading-tight">
        {text}
      </p>
      {/* Triangle for bubble tail */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-800"></div>
    </div>
  );
};

export default ChatBubble;
