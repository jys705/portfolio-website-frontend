'use client'
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const stats = [
    {
      title: "접속 로그 수",
      value: "1,247",
      icon: "📊",
      description: "Today's access logs",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "차단된 위협",
      value: "38",
      icon: "🛡️",
      description: "Blocked threats",
      color: "from-red-500 to-red-600"
    },
    {
      title: "활성 세션",
      value: "156",
      icon: "👥",
      description: "Active user sessions",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header with Back Button */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="text-2xl">🔒</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-MaruBuri">
                Admin Dashboard
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/"
                className="px-6 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black 
                hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 
                font-MaruBuri text-sm"
              >
                ← Back to Portfolio
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-Ovo">
            🔒 Admin Secure Dashboard
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 
              rounded-2xl p-6 border border-blue-200 dark:border-gray-700">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-MaruBuri leading-relaxed">
                이 페이지는 <span className="font-bold text-blue-600 dark:text-blue-400">Okta/Auth0 인증</span>을 
                통과한 관리자만 접근할 수 있습니다.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-MaruBuri">
                🌐 Cloudflare Zero Trust 실습용 대시보드
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-gray-800 p-6 
                hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 
                  group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{stat.icon}</div>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} 
                      text-white text-xs font-bold`}>
                      LIVE
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-Ovo">
                    {stat.value}
                  </h3>
                  
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1 font-MaruBuri">
                    {stat.title}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-MaruBuri">
                    {stat.description}
                  </p>
                </div>

                {/* Animated border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} 
                  opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 
            rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-MaruBuri">
                Zero Trust 보안 실습 환경
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300 font-MaruBuri">
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Cloudflare Access를 통한 애플리케이션 접근 제어</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Okta/Auth0 SSO 통합 인증</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>실시간 보안 모니터링 및 로깅</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 font-MaruBuri">
            🔐 This is a demonstration dashboard for Zero Trust security practices
          </p>
        </motion.div>
      </main>
    </div>
  );
}
