import { useState, useMemo, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { z } from "zod"
import { userLogContext } from '../store/logContext';

export default function Signup() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [userPrompt, setUserPrompt] = useState(undefined);
    const [validInput, setValidInput] = useState(false);
    const navigate = useNavigate();
    const emailSchema = z.string().email();
    const passSchema = z.string().min(8);
    const { userLog, setUserLog } = useContext(userLogContext);
    const { isLoading, err, data, refetch } = useQuery({
        queryKey: ['signin'],
        queryFn: signinUser,
        enabled: false
    })
    async function sendFetch() {
        if (!emailSchema.safeParse(email).success) {
            setValidInput(false);
            setUserPrompt(`Enter a valid email`)
            return;
        }
        if (!passSchema.safeParse(pass).success) {
            setValidInput(false);
            setUserPrompt(`A password should be of 8 characters minimum`)
            return;
        }
        setValidInput(true)
        setUserLog(true)
        refetch();
    }
    async function signinUser() {
        const res = await fetch(`${import.meta.env.VITE_BE_URL}/api/v1/user/signup`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: pass
            }),
            credentials: 'include'
        });
        return await res.json()
    }
    const statusMsg = useMemo(function () {
        if (isLoading) {
            return <div className='text-white'>Loading..</div>
        } if (err) {
            return <div className='text-white'>{err?.message}</div>
        } if (data?.status === "fail") {
            return <div className='text-white'>{data.message}</div>
        }
        return <div className='text-white'>{data?.status}</div>
    }, [isLoading]);
    if (data?.status === "success") {
        setTimeout(() => navigate('/'), 600)
    }
    return (
        <div className='bg-slate-900 h-screen min-h-screen py-60'>
            <div className='bg-gray-400 md:w-1/3 text-center py-2 text-zinc-900 font-medium font-mono text-2xl mx-auto h-[3rem]'>
                Sign-up
            </div>
            <div className='bg-gray-800 h-[25rem] md:w-1/3 mx-auto'>
                <div className='grid grid-cols-2 justify-center text-md pt-12 pb-3'>
                    <div className='flex flex-col *:py-5 *:mx-3'>
                        <span className='px-4 text-gray-100 text-2xl'>Email</span>
                        <span className='px-4 text-gray-100 text-2xl'>Password</span>
                    </div>
                    <div className='flex flex-col *:my-6 *:mx-3 *:px-2'>
                        <input type='text' placeholder='abc@xyz.com' className='rounded-sm' onChange={e => setEmail(e.target.value)} />
                        <input type='password' placeholder='●●●●●●●●' className='rounded-sm' onChange={e => setPass(e.target.value)} />
                    </div>
                </div>
                <div className='text-gray-100 text-center py-1'>{validInput ? "" : userPrompt}</div>
                <div className='text-gray-100 text-center py-1'>{statusMsg}</div>
                <div onClick={sendFetch} className='bg-blue-500 mx-auto w-1/3 h-10 text-center py-2 font-medium text-xl text-slate-100 rounded-md cursor-pointer'>Signup</div>
                <div className='text-gray-100 text-center py-1'>Already a user? <u className='cursor-pointer' onClick={() => navigate('/login')}>Login</u></div>
            </div>
        </div>
    )
}