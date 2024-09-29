import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function Movie() {
    const ref = useRef()
    const navigate = useNavigate()
    const location = useLocation()
    const id = location.pathname.split('/')[2].split('?')[0];
    const { isPending, data, isSuccess } = useQuery({
        queryKey: ['movie'],
        queryFn: fetchMovie
    })
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { // 'en-GB' for Day/Month/Year format
            day: 'numeric',
            month: 'long', // Use 'short' for abbreviated month names
            year: 'numeric',
        });
    };
    async function fetchMovie() {
        const res = await fetch(`/api/v1/movie/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const dt = await res.json();
        const { data: mv } = dt;
        return dt;
    }
    const [showDelete, setShowDelete] = useState(false);
    const [shouldDelete, setShouldDelete] = useState(false);
    const [delData, setDelData] = useState({});
    const [hasFailed, setHasFailed] = useState(false);
    function deleteMovie(e) {
        if (e.target === ref.current) setShouldDelete(true)
        if (e.target === ref.current.nextSibling) setShouldDelete(false)
    }
    useEffect(() => {
        if (shouldDelete) {
            fetch(`/api/v1/movie/${id}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.status === 'fail') {
                        setShouldDelete(false)
                        setHasFailed(true)
                    }
                    else
                        navigate('/')
                    setDelData(data)
                })
        }
    }, [shouldDelete])

    if (isSuccess) {
        const { data: movie } = data;

        return (
            <div className='bg-slate-900 text-white min-h-screen py-36'>
                <div>
                    <div className='flex flex-row flex-wrap w-2/3 mx-auto'>
                        <div className='mx-auto object-scale-down w-[20rem]'>
                            <img className='border' src={movie.posterUrl} alt='Poster' />
                            <div className='text-4xl text-center font-semibold'>{movie.title}
                                <span className='text-3xl text-yellow-300'> {movie.rating}/10</span></div>
                        </div>
                        <div className='xl:w-2/3 mx-auto my-auto px-10 py-10 text-3xl'>
                            {movie.description}
                        </div>
                    </div>
                    <div className='w-2/3 py-5 px-10 text-2xl mx-auto'>Released on: {formatDate(movie.releaseDate)}</div>
                    <div className='w-2/3 py-2 px-10 text-2xl mx-auto'>Genres: {movie.genre.map((genre, index, arr) => {
                        if (arr.length == 1 || index == arr.length - 1) return genre + " "
                        else return genre + ", "
                    })}
                    </div>
                    <div className='text-center mx-auto p-4' onClick={() => setShowDelete(bool => !bool)} >
                        <span className='bg-red-700 w-40 rounded-md p-4 cursor-pointer font-semibold'>Delete Movie</span>
                        {showDelete &&
                            <div className='bg-slate-900 my-9 *:mx-3'>
                                <span ref={ref} onClick={deleteMovie} className='bg-red-700 p-3 rounded-md w-20 cursor-pointer'>YES</span>
                                <span onClick={deleteMovie} className='bg-blue-700 p-3 rounded-md w-20 cursor-pointer'>NO</span>
                                {shouldDelete && delData.status === 'success' && <div>Successfully Deleted</div>}
                            </div>}
                        {hasFailed && <div className='py-5'>Failed to Delete, {delData.message}</div>}
                    </div>
                </div>
                {/* <div className='grid grid-cols-3 px-20 xl:pl-64'>
                    <div className='border border-red-800 flex flex-col object-scale-down w-[20rem]'>
                        <img className='border' src={movie.posterUrl} alt='Poster'></img>
                        <div className='py-5 mx-auto text-4xl font-semibold'>{movie.title}</div>
                    </div>
                    <div className='col-span-2 border border-red-300'>
                        {movie.description}
                    </div>
                </div> */}
                {/* <div className='relative object-scale-down w-[20rem]'>
                        <img className='border' src={movie.posterUrl} alt='Poster'></img>
                        <span className='absolute left-10 py-5 text-4xl font-semibold'>{movie.title}</span>
                    </div> */}
            </div >
        )
    }
}
