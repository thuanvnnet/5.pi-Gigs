"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { usePiAuth } from '@/hooks/use-pi-auth';
import { LayoutDashboard, Package, Users, Settings, LogOut, Loader2, ExternalLink, ShoppingCart, BookOpen } from 'lucide-react';

// Helper cho việc tạo class name động
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = usePiAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Bảo vệ route: Kiểm tra quyền admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/'); // Chuyển hướng người dùng không phải admin về trang chủ
    }
  }, [user, loading, router]);

  // Hiển thị màn hình loading trong khi chờ xác thực
  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/gigs', label: 'Manage Gigs', icon: Package },
    { href: '/admin/categories', label: 'Manage Categories', icon: BookOpen },
    { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Link href="/admin" className="text-xl font-bold text-gray-800">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900',
                pathname === item.href && 'bg-gray-100 text-gray-900 font-semibold'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
           <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-4 w-4" />
              Reset Session
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
           <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => pathname.startsWith(item.href))?.label || 'Admin'}
           </h1>
           <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome, <span className="font-bold text-gray-800">{user.username}</span></span>
              <Link href="/" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View Site <ExternalLink className="w-3 h-3" />
              </Link>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
