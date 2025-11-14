import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const Footer = ({isDarkMode}) => {
  return (
    <div className='mt-20'>
      <div className='text-center'>
        <div className='w-max flex items-center gap-2 mx-auto mb-2'>
            <Image src={isDarkMode ? assets.mail_icon_dark : assets.mail_icon} alt='' className='w-6'/>
            wjddustmd7538@naver.com
        </div>
      </div>

    <div className='text-center sm:flex items-center justify-between border-t
    border-gray-400 mx-[10%] mt-12 py-6'>
        <p>@ 2025 YeonSeung Jeong. All rights reserved.</p>
        <div className='flex justify-center sm:justify-end mt-4 sm:mt-0'>
            <a target='_blank' href="https://itcase.tistory.com/">Tistory</a>
        </div>
    </div>

    </div>
  )
}

export default Footer
