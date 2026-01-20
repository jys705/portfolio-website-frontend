'use client'
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('profile-img2.jpg');
  const [saveStatus, setSaveStatus] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState('');
  const [currentResume, setCurrentResume] = useState(null);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    
    // 현재 설정된 프로필 이미지 불러오기
    fetchCurrentProfile();
    fetchCurrentResume();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const res = await fetch('/api/profileSettings');
      const data = await res.json();
      if (data.success) {
        setSelectedProfile(data.profileImage);
      }
    } catch (error) {
      console.error('Failed to fetch profile settings:', error);
    }
  };

  const fetchCurrentResume = async () => {
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      if (data.success) {
        setCurrentResume(data);
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    }
  };

  const handleProfileChange = async (imageName) => {
    setSelectedProfile(imageName);
    setSaveStatus('saving');
    
    try {
      const res = await fetch('/api/profileSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: imageName })
      });
      
      const data = await res.json();
      if (data.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save profile settings:', error);
      setSaveStatus('error');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    if (file.type !== 'application/pdf') {
      setResumeStatus('error');
      alert('PDF 파일만 업로드 가능합니다.');
      e.target.value = ''; // input 리셋
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeStatus('error');
      alert('파일 크기는 10MB 이하여야 합니다.');
      e.target.value = ''; // input 리셋
      return;
    }

    setResumeFile(file);
    setResumeStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setResumeStatus('success');
        setCurrentResume({ ...data, isDefault: false });
        setTimeout(() => setResumeStatus(''), 3000);
        e.target.value = ''; // input 리셋 - 같은 파일을 다시 선택할 수 있게
      } else {
        setResumeStatus('error');
        alert(data.error || '업로드 실패');
        e.target.value = ''; // input 리셋
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
      setResumeStatus('error');
      alert('업로드 중 오류가 발생했습니다.');
      e.target.value = ''; // input 리셋
    }
  };

  const profileOptions = [
    { 
      name: 'profile-img1.jpg', 
      image: assets.profile_img1, 
      label: '프로필 이미지 1',
      description: '정식 프로필 사진'
    },
    { 
      name: 'profile-img2.jpg', 
      image: assets.profile_img2, 
      label: '프로필 이미지 2',
      description: '캐주얼 프로필 사진'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-300">
      {/* Modern Admin Header */}
      <nav className="backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-Ovo">
                  Admin Dashboard
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-MaruBuri">관리자 제어판</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-black hover:shadow-lg transition-all duration-300 font-MaruBuri text-sm font-semibold"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                포트폴리오로 돌아가기
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 font-Ovo">
                  환영합니다! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-MaruBuri text-lg">
                  관리자 전용 대시보드입니다. 포트폴리오 설정을 관리할 수 있습니다.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Image Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-MaruBuri mb-1">
                  프로필 이미지 관리
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-MaruBuri">
                  Home 섹션과 About me 섹션에 표시될 프로필 이미지를 선택하세요
                </p>
              </div>
            </div>

            {/* Profile Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {profileOptions.map((option) => (
                <motion.div
                  key={option.name}
                  whileHover={{ y: -4 }}
                  onClick={() => handleProfileChange(option.name)}
                  className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedProfile === option.name
                      ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-500/50'
                      : 'ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-blue-300 dark:hover:ring-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Image Container */}
                  <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <Image 
                      src={option.image} 
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
                      selectedProfile === option.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></div>
                  </div>
                  
                  {/* Selection Badge */}
                  {selectedProfile === option.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                  
                  {/* Info Section */}
                  <div className={`p-6 transition-colors duration-300 ${
                    selectedProfile === option.name
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <h4 className="font-bold text-lg mb-1 font-MaruBuri">
                      {option.label}
                    </h4>
                    <p className={`text-sm font-MaruBuri ${
                      selectedProfile === option.name
                        ? 'text-white/90'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.description}
                    </p>
                    
                    {/* Select Button */}
                    <div className="mt-4">
                      {selectedProfile === option.name ? (
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          선택됨
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          클릭하여 선택
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Status Message */}
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 font-MaruBuri font-semibold ${
                  saveStatus === 'saved' 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : saveStatus === 'saving'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {saveStatus === 'saved' && (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>프로필 이미지가 성공적으로 변경되었습니다!</span>
                  </>
                )}
                {saveStatus === 'saving' && (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>저장 중...</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>저장 중 오류가 발생했습니다.</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Resume Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-MaruBuri mb-1">
                  이력서 관리
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-MaruBuri">
                  Home 섹션의 "my resume" 버튼에서 다운로드될 이력서를 업로드하세요
                </p>
              </div>
            </div>

            {/* Current Resume Info */}
            {currentResume && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white font-MaruBuri">
                        {currentResume.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-MaruBuri">
                        {currentResume.isDefault ? '기본 이력서' : `업로드: ${new Date(currentResume.uploadedAt).toLocaleString('ko-KR')}`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={currentResume.url}
                    download
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors font-MaruBuri"
                  >
                    다운로드
                  </a>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-green-500 dark:hover:border-green-500 transition-colors">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer block"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1 font-MaruBuri">
                      PDF 파일을 선택하거나 드래그하세요
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-MaruBuri">
                      최대 10MB, PDF 형식만 가능합니다
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all font-MaruBuri"
                  >
                    파일 선택
                  </button>
                </div>
              </label>
            </div>

            {/* Upload Status */}
            {resumeStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl flex items-center gap-3 font-MaruBuri font-semibold ${
                  resumeStatus === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : resumeStatus === 'uploading'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {resumeStatus === 'success' && (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>이력서가 성공적으로 업로드되었습니다!</span>
                  </>
                )}
                {resumeStatus === 'uploading' && (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>업로드 중...</span>
                  </>
                )}
                {resumeStatus === 'error' && (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>업로드 실패</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-blue-100 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-MaruBuri">
                💡 사용 안내
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-MaruBuri text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>원하는 프로필 이미지를 클릭하면 자동으로 저장됩니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>변경사항은 즉시 포트폴리오 페이지에 반영됩니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Home 섹션(헤더)와 About me 섹션에 동일한 이미지가 적용됩니다</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
