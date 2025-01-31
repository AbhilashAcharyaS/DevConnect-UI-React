import { useSelector } from "react-redux"
import EditProfile from "./EditProfile"

function Profile() {
  const user=useSelector(store=>store.user)
  return (
    <div className="min-h-screen">

      {user && <EditProfile user={user}/>}
    </div>
  )
}

export default Profile