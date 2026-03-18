import Link from 'next/link'
import { MessageSquare, Upload, BarChart2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-3">
        Multi-Agent AI System
      </h1>
      <p className="text-gray-400 text-lg mb-12">
        Powered by LangChain, FastAPI, Pinecone and Next.js
      </p>

      <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
        <Link href="/chat" className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 text-center transition-colors">
          <MessageSquare size={36} className="mx-auto mb-3 text-blue-400" />
          <h2 className="text-white font-semibold">Chat</h2>
          <p className="text-gray-400 text-sm mt-1">Talk to AI agents</p>
        </Link>

        <Link href="/upload" className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 text-center transition-colors">
          <Upload size={36} className="mx-auto mb-3 text-green-400" />
          <h2 className="text-white font-semibold">Upload</h2>
          <p className="text-gray-400 text-sm mt-1">Add documents and data</p>
        </Link>

        <Link href="/dashboard" className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 text-center transition-colors">
          <BarChart2 size={36} className="mx-auto mb-3 text-yellow-400" />
          <h2 className="text-white font-semibold">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">View analytics</p>
        </Link>
      </div>
    </div>
  )
}