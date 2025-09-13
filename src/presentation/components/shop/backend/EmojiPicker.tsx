"use client";

import { useState } from "react";

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
  placeholder?: string;
}

// Common service-related emojis organized by categories
const EMOJI_CATEGORIES = {
  บริการผม: ["💇‍♀️", "💇‍♂️", "✂️", "🪒", "🧴", "💈"],
  บริการเล็บ: ["💅", "👝", "💄", "💋", "🎨"],
  บริการสปา: ["💆‍♀️", "💆‍♂️", "🧖‍♀️", "🧖‍♂️", "🕯️", "🌸"],
  บริการออกกำลังกาย: ["🏋️‍♀️", "🏋️‍♂️", "🏃‍♀️", "🏃‍♂️", "🤸‍♀️", "🤸‍♂️", "🧘‍♀️", "🧘‍♂️"],
  บริการทางการแพทย์: ["👨‍⚕️", "👩‍⚕️", "🦷", "👁️", "🩺", "💊", "🏥"],
  บริการร้านอาหาร: ["🍽️", "🍴", "👨‍🍳", "👩‍🍳", "🍕", "🍔", "🍜", "☕"],
  บริการซักผ้า: ["🧺", "👕", "👖", "🧼", "🧽"],
  บริการซ่อมแซม: ["🔧", "⚙️", "🔨", "⚡", "🔩", "🛠️", "🚗", "🏠"],
  บริการอื่นๆ: [
    "📱",
    "💻",
    "📷",
    "🎵",
    "🎨",
    "📚",
    "🎮",
    "🛍️",
    "🎁",
    "🌟",
    "⭐",
    "✨",
  ],
};

export function EmojiPicker({
  selectedEmoji,
  onEmojiSelect,
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  const handleClear = () => {
    onEmojiSelect("");
  };

  return (
    <div className="relative">
      {/* Selected emoji display */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-colors"
        >
          {selectedEmoji ? (
            <span className="text-2xl">{selectedEmoji}</span>
          ) : (
            <span className="text-gray-400 text-sm">📋</span>
          )}
        </button>

        {selectedEmoji && (
          <button
            type="button"
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ลบ
          </button>
        )}
      </div>

      {/* Emoji picker dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-4 max-h-64 overflow-y-auto">
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <div key={category} className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-lg"
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              คลิกที่ emoji เพื่อเลือก
            </p>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
