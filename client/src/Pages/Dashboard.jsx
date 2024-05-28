import { useLocation } from "react-router-dom"
import { useState,useEffect } from "react"
import DashProfile from "../components/DashProfile"
import DashSidebar from "../components/DashSidebar"
import DashPost from "../components/DashPost"
import DashUsers from "../components/DashUsers"
import DashComment from "../components/DashComment"
import DashboardComp from "../components/DashboardComp"


export default function Dashboard() {
  const location = useLocation()
  const [tab,setTab] = useState('')

  useEffect(()=>{
    const urlParams= new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      
      {/* posts... */}

      {tab === 'posts' && <DashPost/>}
       {/* users... */}

       {tab === 'users' && <DashUsers/>}
       {/* comment... */}

       { tab ==='comments' && <DashComment/>}

              {/* Dashboard... */}

       { tab ==='dash' && <DashboardComp/>}

       </div>
  )
}
