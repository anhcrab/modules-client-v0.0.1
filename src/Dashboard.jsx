import { useState } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {

  return (
    <div>
        <h1>Dashboard</h1>
        <h5>
          <Link to={'/shop'}>Xem cửa hàng</Link>
        </h5>
    </div>
  )
}

export default Dashboard
