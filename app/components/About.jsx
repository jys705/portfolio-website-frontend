import { assets, infoList, toolsData } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {motion} from "motion/react"

const About = ({isDarkMode}) => {
  const [profileImg, setProfileImg] = useState(null);
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
    
    fetchProfileImage();
  }, []);

  return (
    <motion.div id='about' className='w-full max-w-[100vw] px-4 sm:px-8 md:px-[12%] py-10 scroll-mt-20'
    initial={{opacity: 0}}
    whileInView={{opacity: 1}}
    transition={{duration: 1}}>
      <motion.h4 
      initial={{opacity: 0, y: -20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: 0.3}}
      className='text-center mb-2 text-lg font-Ovo'>
        Introfucion</motion.h4>

      <motion.h2 
      initial={{opacity: 0, y: -20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: 0.5}}
      className='text-center text-5xl font-Ovo px-2 break-words'>
        About me</motion.h2>

        <motion.div 
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{duration: 0.8}}
        className='flex w-full flex-col lg:flex-row items-center
        gap-20 my-20'>
            <motion.div 
            initial={{opacity: 0, scale: 0.9}}
            whileInView={{opacity: 1, scale: 1}}
            transition={{duration: 0.6}}
            className='w-64 sm:w-80 rounded-3xl max-w-none relative'>
                {profileImg && (
                  <Image 
                    src={profileImg} 
                    alt='user' 
                    className={`w-full rounded-3xl transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
                {!imageLoaded && (
                  <div className='absolute inset-0 rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse' />
                )}
            </motion.div>
            <motion.div 
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.8}}
            className='flex-1 px-1'>
                <p className='mb-10 max-w-2xl font-MaruBuri'
                >저는 DevSecOps 분야에 깊은 관심을 가지고, 보안과 자동화가 조화를 이루는 개발 환경을 연구하는 소프트웨어학부 학생입니다.
학습과 프로젝트를 통해 안전하고 효율적인 시스템을 구축하는 방법을 탐구하고자 합니다.</p>

                <motion.ul 
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                transition={{duration: 0.8, delay: 1}}
                className='grid grid-cols-1 sm:grid-cols-3 gap-6
                max-w-2xl w-full'>
                    {infoList.map(({icon, iconDark, title, description},
                    index)=>(
                        <motion.li 
                        whileHover={{scale: 1.05}}
                        className='border-[0.5px] border-gray-400
                        rounded-xl p-6 cursor-pointer hover:bg-lightHover
                        hover:-translate-y-1 duration-500 
                        hover:shadow-black dark:border-white 
                        dark:hover:shadow-white dark:hover:bg-darkHover/50'
                        key={index}>
                            <Image src={isDarkMode ? iconDark : icon} alt={title} className='w-7
                            mt-3'/>
                            <h3 className='my-4 font-semibold
                            text-gray-700 dark:text-white'>{title}</h3>
                            <p className='text-gray-600 text-sm dark:text-white/80 font-MaruBuri'>
                            {description}</p>
                        </motion.li>
                    ))}
                </motion.ul>

                <motion.h4 
                initial={{y: 20, opacity: 0}}
                whileInView={{y:0, opacity: 1}}
                transition={{delay: 1.3, duration: 0.5}}
                className='mt-6 text-gray-700 font-Ovo dark:text-white/80'>Tools I use</motion.h4>

                <motion.ul
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                transition={{delay: 1.5, duration: 0.6}}
                className='flex items-center gap-3 sm:gap-5 flex-wrap'>
                    {toolsData.map((tool, index)=>(
                        <motion.li
                        whileHover={{scale: 1.1}}
                        className='flex items-center justify-center
                        w-12 sm:w-14 aspect-square border border-gray-400
                        rounded-lg cursor-pointer hover:-translate-y-1
                        duration-500'
                        key={index}>
                            <Image src={isDarkMode ? tool.dark : tool.light} alt='Tool' className='w-5
                            sm:w-7'/>
                        </motion.li>

                    ))}
                </motion.ul>
            </motion.div>
        </motion.div>
    </motion.div>
  )
}

export default About
