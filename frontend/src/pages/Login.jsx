import { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { z } from "zod"
import { userLogContext } from '../store/logContext';

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [userPrompt, setUserPrompt] = useState(undefined);
    const [validInput, setValidInput] = useState(false);
    const navigate = useNavigate();
    const emailSchema = z.string().min(1).email();
    const passSchema = z.string().min(8);
    const { userLog, setUserLog } = useContext(userLogContext);
    const { isLoading, err, data, refetch, isSuccess } = useQuery({
        queryKey: ['signin'],
        queryFn: loginUser,
        enabled: false
    })
    async function sendFetch() {
        if (!emailSchema.safeParse(email).success) {
            setValidInput(false);
            setUserPrompt(`Enter a valid username`)
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
    async function loginUser() {
        const res = await fetch("/api/v1/user/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: pass
            })
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
    }, [isLoading, data]);
    if (isSuccess && data?.status === "success") {
        setTimeout(() => navigate('/'), 600)
    }
    return (
        <div className='bg-slate-900 h-screen min-h-screen py-60'>
            <div className='bg-gray-400 md:w-1/3 text-center py-2 text-zinc-900 font-medium font-mono text-2xl mx-auto h-[3rem]'>
                Login
            </div>
            <div className='bg-gray-800 h-[20rem] md:w-1/3 mx-auto'>
                <div className='flex flex-col *:mt-10 *:mx-10 *:px-2'>
                    <input type='text' placeholder='Email' className='rounded-sm' onChange={e => setEmail(e.target.value)} />
                    <input type='password' placeholder='Password' className='mb-10 rounded-sm' onChange={e => setPass(e.target.value)} />
                </div>
                <div className='text-gray-100 text-center py-1'>{validInput ? "" : userPrompt}</div>
                <div className='text-gray-100 text-center py-1'>{statusMsg}</div>
                <div onClick={sendFetch} className='bg-blue-500 mx-auto w-1/3 h-10 text-center py-2 font-medium text-xl text-slate-100 rounded-md cursor-pointer'>Login</div>
                <div className='text-gray-100 text-center py-1'>New User? <u className='cursor-pointer' onClick={() => navigate('/signup')}>Signup</u></div>
            </div>
        </div>
    )
}
