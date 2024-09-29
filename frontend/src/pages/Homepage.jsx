import { useContext, useEffect, useState } from "react";
import { userLogContext } from "../store/logContext";
import MovieCard from "../components/MovieCard";
import { useQuery } from "@tanstack/react-query";
import Search from "../components/Search";
import { Link } from "react-router-dom";

export default function Homepage() {
    const limit = 8;
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("");
    const { userLog } = useContext(userLogContext);
    const { data, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['movies'],
        queryFn: getMovies,
    })
    useEffect(() => {
        const tout = setTimeout(() => (refetch()), 400);
        return () => clearTimeout(tout);
    }, [filter])
    useEffect(() => { refetch() }, [page])
    async function getMovies() {
        let res;
        if (filter) {
            res = await fetch(`${import.meta.env.VITE_BE_URL}/api/v1/movie/bulk?page=${page}&limit=${limit}&filter=${filter}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
        } else {
            res = await fetch(`${import.meta.env.VITE_BE_URL}/api/v1/movie/bulk?page=${page}&limit=${limit}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
        }
        return await res.json()
    }
    function filterChange(e) {
        setFilter(e.target.value)
        // console.log(filter)
    }

    // if (userLog)
    if (isPending) return <div className="text-4xl">Loading</div>
    if (isSuccess && userLog) {
        console.log(data)
        return (
            <div className='bg-slate-900 min-h-screen py-24 text-white'>
                <div className="py-10">
                    <Search filterChange={filterChange} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 px-5 sm:px-10">
                    {data?.data.map((movie, index) => <Link className="border w-0" key={index} to={`/movie/${movie._id}`}><MovieCard key={index + 1} title={movie.title} posterUrl={movie.posterUrl} /></Link>)}
                </div>
                <div>
                    <Pagination limit={limit} total={data?.total} setPage={setPage} />
                </div>
            </div>
        )
    }
    else
        return (
            <div className='bg-slate-900 h-screen min-h-screen py-60 flex justify-center text-white font-semibold text-5xl md:text-[10vh]'>
                You Are Unauthorized
            </div>
        )

}

function Pagination({ limit, total, setPage }) {
    const nPage = Math.ceil(total / limit);
    const pages = []
    for (let i = 1; i <= nPage; i++) pages.push(i);
    return (
        <div className="flex flex-row justify-center *:my-8 *:mr-1">
            {pages.map(num => <PageButton onClick={() => setPage(num)} key={num} num={num} />)}
        </div>
    )

}
function PageButton({ num, onClick }) {
    return (
        <span onClick={() => {
            console.log("CLICKED")
            onClick()
        }} className="border-x border-blue-400 w-6 text-center cursor-pointer">
            {num}
        </span>
    )
}