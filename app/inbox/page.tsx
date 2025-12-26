"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export default function InboxPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "PiMaster_VN", text: "Chào bạn, mình có thể giúp gì cho việc cài Node của bạn?", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", text: "Mình muốn hỏi cấu hình máy tính của mình có chạy nổi không?", time: "10:32 AM", isMe: true },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    const newMessage = {
      id: messages.length + 1,
      sender: "Me",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }
    setMessages([...messages, newMessage])
    setInputValue("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex h-[600px] overflow-hidden">
          
          {/* CỘT TRÁI: DANH SÁCH HỘI THOẠI */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-900">Tin nhắn</div>
            <div className="flex-grow overflow-y-auto">
              <div className="p-4 bg-[#1dbf73]/10 border-l-4 border-purple-600 flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">P</div>
                <div>
                  <div className="text-sm font-bold">PiMaster_VN</div>
                  <div className="text-xs text-gray-500 truncate w-32">Chào bạn, mình có thể...</div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHAT */}
          <div className="flex-grow flex flex-col">
            {/* Header chat */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="font-bold">PiMaster_VN</div>
              <Button variant="outline" size="sm" className="text-[#1dbf73] border-purple-200">Xem hồ sơ</Button>
            </div>

            {/* Khung tin nhắn */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70% ] p-3 rounded-lg text-sm shadow-sm ${
                    msg.isMe ? 'bg-[#1dbf73] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 opacity-70 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ô nhập liệu */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..." 
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} className="bg-[#1dbf73] hover:bg-[#1dbf73]/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}