import { assets } from '@/assets/assets'
import React, { useState } from 'react'
import Image from 'next/image'
import {motion} from "motion/react"

const Contact = () => {

    const [result, setResult] = useState("");

    const onSubmit = async (event) => {
      event.preventDefault();
      setResult("Sending....");
      const formData = new FormData(event.target);
  
      formData.append("access_key", "9654c856-6358-4f4c-a607-e55923faa65e");
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    };

  return (
    <motion.div
    initial={{opacity: 0}}
    whileInView={{opacity: 1}}
    transition={{duration: 1}}
    id='contact' className='w-full max-w-[100vw] px-4 sm:px-8 md:px-[12%] py-10 scroll-mt-20 relative'>
      <div className='absolute inset-0 left-1/2 transform -translate-x-1/2 w-[120%] h-full bg-[url("/footer-bg-color.png")] bg-no-repeat bg-center bg-[length:100%_auto] dark:bg-none z-[-1]' style={{maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'}}></div>
      
      <motion.h4 
      initial={{y: -20, opacity: 0}}
      whileInView={{y:0, opacity: 1}}
      transition={{delay: 0.3, duration: 0.5}}
      className='text-center mb-2 text-lg font-Ovo'>
        Connect with me</motion.h4>
        
        <motion.h2 
        initial={{y: -20, opacity: 0}}
        whileInView={{y:0, opacity: 1}}
        transition={{delay: 0.5, duration: 0.5}}
        className='text-center text-5xl font-Ovo px-2 break-words'>
        Get in touch</motion.h2>

        <motion.p
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{delay: 0.7, duration: 0.5}}
        className='text-center max-w-2xl mx-auto mt-5 mb-12 font-MaruBuri px-2'>
        여러분의 이야기를 듣고 싶습니다!<br />
        질문, 의견 또는 피드백이 있으시면 아래 양식을 사용해 주세요.</motion.p> 

        <motion.form 
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{delay: 0.9, duration: 0.5}}
        onSubmit={onSubmit} className='max-w-2xl mx-auto px-2'>
            <div className='grid grid-cols-auto gap-6 mt-10 mb-8'>
                
                <motion.input
                initial={{x: -50, opacity: 0}}
                whileInView={{x:0, opacity: 1}}
                transition={{delay: 1.1, duration: 0.6}}
                type="text" placeholder='이름을 입력하세요' required
                className='flex-1 p-3 outline-none border-[0.5px] border-gray-400
                rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90 font-MaruBuri' name='name'/>

                <motion.input
                initial={{x: 50, opacity: 0}}
                whileInView={{x:0, opacity: 1}}
                transition={{delay: 1.2, duration: 0.6}}
                type="email" placeholder='이메일을 입력하세요' required
                className='flex-1 p-3 outline-none border-[0.5px] border-gray-400
                rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90 font-MaruBuri' name='email'/>
            
            </div>
            <motion.textarea
            initial={{y: 100, opacity: 0}}
            whileInView={{y:0, opacity: 1}}
            transition={{delay: 1.3, duration: 0.6}}
            rows='6' placeholder='메시지를 입력하세요' required
            className='w-full p-4 outline-none border-[0.5px] border-gray-400
            rounded-md bg-white mb-6 dark:bg-darkHover/30 dark:border-white/90 font-MaruBuri' name='message'></motion.textarea>

            <motion.button
            whileHover={{scale: 1.05}}
            transition={{duration: 0.3}}
            type='submit' 
            className='py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 
            text-white rounded-full mx-auto hover:bg-black duration-500 
            dark:bg-transparent dark:border-[0.5px] dark:hover:bg-darkHover'
            >Submit now <Image src={assets.right_arrow_white} alt='' className='w-4'/>
            </motion.button>

            <p className='mt-4 text-center'>{result}</p>
        </motion.form>
    </motion.div>
  )
}

export default Contact
