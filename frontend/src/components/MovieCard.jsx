import { Link, useNavigate } from "react-router-dom"

export default function MovieCard({ id, title, posterUrl }) {
    // const navigate = useNavigate();
    // function redToMovie() {
    //     navigate(`/movie/${id}`)
    // }
    return (

        <div>
            <div className='relative cursor-pointer group w-[20rem] bg-slate-700 border border-white text-white'>
                <div className='opacity-0 group-hover:opacity-30 absolute bg-black w-full h-full'></div>
                <div className='flex flex-col items-center'>
                    <img className='object-contain' src={posterUrl} alt="poster" />
                    <span className='group-hover:opacity-100 opacity-0 underline absolute bottom-5 text-2xl'>{title}</span>
                </div>
            </div>
        </div>
    )
}
