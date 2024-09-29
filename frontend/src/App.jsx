import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { userLogContext } from './store/logContext'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useEffect, useState } from 'react'
import Homepage from './pages/Homepage'
import PageNotFound from './pages/PageNotFound'
import Header from './components/Header'
import Movie from './pages/Movie'

const queryClient = new QueryClient()

function App() {
  const [userLog, setUserLog] = useState(false)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BE_URL}/api/v1/user/me`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then(data => {
        // console.log(data);
        if (data.status === 'success') setUserLog(true)
        if (data.status === 'fail') setUserLog(false)
      })
  }, [])
  const { Provider } = userLogContext;
  return (
    <>
      <BrowserRouter>
        {userLog && <Provider value={{ userLog, setUserLog }}><Header /></Provider>}
        <Routes>
          <Route path='/' element={<Provider value={{ userLog, setUserLog }}><QueryClientProvider client={queryClient}><Homepage /></QueryClientProvider></Provider>} />
          <Route path='/signup' element={<Provider value={{ userLog, setUserLog }}><QueryClientProvider client={queryClient}><Signup /></QueryClientProvider></Provider>} />
          <Route path='/login' element={<Provider value={{ userLog, setUserLog }}><QueryClientProvider client={queryClient}><Login /></QueryClientProvider></Provider>} />
          <Route path='/movie/:id' element={<QueryClientProvider client={queryClient}><Movie /></QueryClientProvider>} />
          {/* <Route path='/user/:id' element={<QueryClientProvider client={queryClient}><NewMovie /></QueryClientProvider>} /> */}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App