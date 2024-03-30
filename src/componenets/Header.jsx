import React from 'react'
import { useLocation, useNavigate } from 'react-router';

export default function Header() {
    const path  = useLocation().pathname;
    const navigate = useNavigate();
    function isPathCorrect(pathname) {
        return pathname === path;
    }
    
  return (

    

    <div className='bg-white shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between px-20 items-center max-w-6xl
                mx-auto'>
            <div>
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt="logo" className='h-20 cursor-pointer p-2'
                    onClick={()=> navigate('/')}
                />
            </div>
            <div >
                <ul className='flex space-x-10'>
                    <li className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${isPathCorrect("/") && "text-gray-800 border-b-cyan-950"}
                    `
                    } onClick={()=> navigate('/')}>Home</li>
                    <li className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${isPathCorrect("/offers") && "text-gray-800 border-b-cyan-950"}
                    `} onClick={()=> navigate('offers')}>Offers</li>
                    <li className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${isPathCorrect("/sign-in") && "text-gray-800 border-b-cyan-950"}
                    `} onClick={()=> navigate('/sign-in')}>Sign In</li>
                </ul>
            </div>
        </header>
    </div>
  )
}
