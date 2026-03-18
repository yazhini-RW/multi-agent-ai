'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Upload, BarChart2 } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  ]

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-6 fixed left-0 top-0">
      <h1 className="text-xl font-bold mb-8 text-blue-400">
        Multi-Agent AI
      </h1>
      <nav className="flex flex-col gap-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}