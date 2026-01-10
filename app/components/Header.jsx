import { assets } from '@/assets/assets'
import React from 'react'
import Image from 'next/image'
import { motion } from "motion/react"

const Header = () => {
  return (
    <div className='w-full max-w-[100vw] text-center px-4 mx-auto h-screen flex flex-col
    items-center justify-center gap-4'>
      <div>
            <Image src={assets.profile_img} alt='' className='rounded-full w-32'/>
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

            <motion.a
            initial={{y: 30, opacity: 0}}
            whileInView={{y: 0, opacity: 1}}
            transition={{duration: 0.6, delay: 1.2}}
            href="/정연승_이력서.pdf" download
            className='px-10 py-3 border rounded-full border-gray-500 flex
            items-center gap-2 bg-white dark:text-black'>my resume <Image src={assets.download_icon} alt=''
            className='w-4'/></motion.a>
        </div>
    </div>
  )
}

export default Header
