import { useContext } from 'react'
import { userLogContext } from '../store/logContext';
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate();
    const { setUserLog } = useContext(userLogContext)
    async function logoutUser() {
        const res = await fetch(`${import.meta.env.VITE_BE_URL}/api/v1/user/logout`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        setUserLog(false);
        // console.log(data);
        if (data.status === 'success') navigate('/')
    }
    return (
        <div className='bg-gray-800 text-gray-300 h-[3rem] items-center flex flex-row justify-between sm:px-[10rem]'>
            <div className='text-xl'>
                <Link className='underline' to={'/'}>Movies</Link>
            </div>
            <div className='flex flex-row *:px-5'>
                <div>
                    <Link to={'/user/movies'}><div className="cursor-pointer text-white bg-violet-700 ml-2 py-1 px-2 rounded-sm" >Edit Movie</div></Link>
                </div>
                <div onClick={logoutUser} className='bg-blue-600 p-1 rounded-sm hover:bg-blue-900 hover:cursor-pointer hover:text-white'>
                    Logout
                </div>
            </div>
        </div>
    )
}
