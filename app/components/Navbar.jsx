import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const Navbar = ({isDarkMode, setIsDarkMode}) => {

    const [isScroll, setIsScroll] = useState(false)
    const [isWorkSectionVisible, setIsWorkSectionVisible] = useState(false)
    const sideMenuRef = useRef();

    const openMenu = () => {
        sideMenuRef.current.style.transform = 'translate(-16rem)'
    }
    const closeMenu = () => {
        sideMenuRef.current.style.transform = 'translate(16rem)'
    }

    useEffect(()=>{
        const handleScroll = () => {
            if(scrollY > 50){
                setIsScroll(true)
            } else {
                setIsScroll(false)
            }
            
            // Work 섹션 영역 확인
            const workSection = document.getElementById('work');
            if (workSection) {
                const workRect = workSection.getBoundingClientRect();
                // Work 섹션이 화면에 보이는지 확인 (상단 70px 여유 고려)
                const isVisible = 
                    workRect.top <= 70 && 
                    workRect.bottom >= 70;
                setIsWorkSectionVisible(isVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    },[]);

  return (
    <>
    <div className='fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%] 
    dark:hidden'>
        <Image src={assets.header_bg_color} alt='' className='w-full' />
    </div>
    
        <nav className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex 
            items-center z-50 
            ${isScroll ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-sm dark:bg-darkTheme dark:shadow-white/20" : ""}`}>
            <div className="flex items-center justify-between w-full">
              <a href="#top" className="flex-shrink-0">
                  <Image src={isDarkMode ? assets.logo_dark : assets.logo} alt='' className='w-28 alt="" 
                  cursor-pointer'/>
              </a>

              <div className="flex-1 flex justify-center mx-2 lg:mx-4">
                <ul className={`hidden md:flex items-center md:gap-4 lg:gap-6 xl:gap-8 
                    rounded-full md:px-4 lg:px-8 xl:px-12 py-3 mx-auto overflow-x-auto
                    ${isScroll ? "" : "bg-white shadow-sm bg-opacity-50 dark:border dark:border-white/50 dark:bg-transparent"} `}>
                    <li><a className='font-Ovo text-nowrap' href="#top">Home</a></li>
                    <li><a className='font-Ovo text-nowrap' href="#about">About me</a></li>
                    <li><a className='font-Ovo text-nowrap' href="#services">Services</a></li>
                    <li><a className='font-Ovo text-nowrap' href="#work">My work</a></li>
                    <li><a className='font-Ovo text-nowrap' href="#contact">Contact me</a></li>
                    <li className='relative ml-1'>
                      <a className='font-Ovo text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative inline-block text-nowrap' href="#chat">
                        Chatbot
                        <div className='absolute bottom-1 left-[-3.1px] w-full h-[1.4px] dark:hidden transition-opacity duration-300 ease-in-out' style={{ opacity: isWorkSectionVisible ? 0 : 1 }}>
                          <Image src={assets.header_bg_color} alt='' className='w-full h-full object-cover' />
                        </div>
                      </a>
                    </li>
                </ul>
              </div>

              <div className='flex items-center gap-4 flex-shrink-0'>
                  <button onClick={()=> setIsDarkMode(prev => !prev)}>
                      <Image src={isDarkMode ? assets.sun_icon : assets.moon_icon} alt='' className='w-6' />
                  </button>

                  <a href="#contact" className='hidden lg:flex items-center gap-3
                  px-10 py-2.5 border border-gray-500 rounded-full ml-4 font-Ovo
                  dark:border-white/50'>Contact 
                  <Image src={isDarkMode ? assets.arrow_icon_dark : assets.arrow_icon} alt="" 
                  className='w-3'/></a>

                  <button className='block md:hidden ml-3' onClick={openMenu}>
                      <Image src={isDarkMode ? assets.menu_white : assets.menu_black} alt='' className='w-6' />
                  </button>
              </div>
            </div>

            {/* -- ------ mobile menu ------ -- */}
            
            <ul ref={sideMenuRef} className='flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64
            top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500 dark:bg-darkHover dark:text-white'>

                <div className='absolute right-6 top-6' onClick={closeMenu}>
                    <Image src={isDarkMode ? assets.close_white : assets.close_black} alt='' className='w-5
                    cursor-pointer' />
                </div>

                <li><a className='font-Ovo' onClick={closeMenu} href="#top">Home</a></li>
                <li><a className='font-Ovo' onClick={closeMenu} href="#about">About me</a></li>
                <li><a className='font-Ovo' onClick={closeMenu} href="#services">Services</a></li>
                <li><a className='font-Ovo' onClick={closeMenu} href="#work">My work</a></li>
                <li><a className='font-Ovo' onClick={closeMenu} href="#contact">Contact me</a></li>
                <li className='mt-2 border-t border-gray-300 dark:border-gray-600 pt-2'>
                  <a className='font-Ovo text-gray-500 dark:text-gray-400' onClick={closeMenu} href="#chat">
                    Chatbot
                  </a>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default Navbar
