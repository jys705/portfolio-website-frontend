import { assets } from '@/assets/assets'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from "motion/react"

const Header = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('/정연승_이력서.pdf');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch('/api/profileSettings');
        const data = await res.json();
        if (data.success) {
          const selectedImage = data.profileImage === 'profile-img1.jpg' 
            ? assets.profile_img1 
            : assets.profile_img2;
          setProfileImg(selectedImage);
        } else {
          setProfileImg(assets.profile_img2);
        }
      } catch (error) {
        console.error('Failed to fetch profile image:', error);
        setProfileImg(assets.profile_img2);
      }
    };

    const fetchResumeUrl = async () => {
      try {
        const res = await fetch('/api/resume');
        const data = await res.json();
        if (data.success && data.url) {
          setResumeUrl(data.url);
        }
      } catch (error) {
        console.error('Failed to fetch resume URL:', error);
      }
    };
    
    fetchProfileImage();
    fetchResumeUrl();
  }, []);

  const handleResumeDownload = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '정연승_이력서.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download resume:', error);
      // 실패 시 기본 다운로드 시도
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <div className='w-full max-w-[100vw] text-center px-4 mx-auto h-screen flex flex-col
    items-center justify-center gap-4'>
      <div className='relative w-32 h-32 overflow-hidden rounded-full'>
            {profileImg && (
              <Image 
                src={profileImg} 
                alt='' 
                className={`w-32 h-32 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${
                  profileImg === assets.profile_img1 ? 'object-[center_20%]' : 'object-center'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {!imageLoaded && (
              <div className='absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse' />
            )}
      </div>
      <motion.h3
      initial={{y: -20, opacity: 0}}
      whileInView={{y: 0, opacity: 1}}
      transition={{duration: 0.6, delay: 0.3}}
      className='flex items-end justify-center gap-2 text-xl md:text-2xl mb-1 font-MaruBuri'>
                안녕하세요! 저는 정연승입니다 <Image src={assets.hand_icon} alt=''
            className='w-6 -translate-y-1.5'/></motion.h3>
    <motion.h1
    initial={{y: -30, opacity: 0}}
    whileInView={{y: 0, opacity: 1}}
    transition={{duration: 0.8, delay: 0.5}}
    className='text-3xl sm:text-5xl lg:text-6xl font-Ovo px-2 max-w-[100vw] break-words mb-4'>
        Exploring DevSecOps — where<br />development, security, and operations meet. </motion.h1>

        <motion.p
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{duration: 0.6, delay: 0.7}}
        className='max-w-2xl mx-auto font-MaruBuri px-2'>
            저는 자동화와 보안이 조화를 이루는 개발 환경에 관심이 많은 소프트웨어학 전공 학생입니다.
            현재 소프트웨어 개발과 클라우드 인프라 구축을 함께 공부하고 있습니다.
        </motion.p>
        <div className='flex flex-col sm:flex-row items-center gap-4 mt-6'>
            <motion.a 
            initial={{y: 30, opacity: 0}} 
            whileInView={{y: 0, opacity: 1}}
            transition={{duration: 0.6, delay: 1}}
            href="#contact"
            className='px-10 py-3 border border-white rounded-full bg-black
            text-white flex items-center gap-2 dark:bg-transparent'>
            contact me <Image src={assets.right_arrow_white} alt='' 
            className='w-4'/></motion.a>

            <motion.button
            initial={{y: 30, opacity: 0}}
            whileInView={{y: 0, opacity: 1}}
            transition={{duration: 0.6, delay: 1.2}}
            onClick={handleResumeDownload}
            className='px-10 py-3 border rounded-full border-gray-500 flex
            items-center gap-2 bg-white dark:text-black cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
            my resume <Image src={assets.download_icon} alt=''
            className='w-4'/></motion.button>
        </div>
    </div>
  )
}

export default Header
