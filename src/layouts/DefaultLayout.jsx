import {Link, Navigate, Outlet} from "react-router-dom";
import {StateContext} from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import {useContext, useEffect} from "react";

export default function DefaultLayout() {
  const {user, token, setUser, setToken, notification} = useContext(StateContext);

  if (!token) {
    return <Navigate to="/login"/>
  }

  const onLogout = ev => {
    ev.preventDefault()

    axiosClient.post('/auth/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/users')
      .then(({data}) => {
        setUser(data)
      })
  }, [])

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard" className="side-nav">Dashboard</Link>
        <Link to="/users" className="side-nav">Users</Link>
        <Link to="/media" className="side-nav">Media (chưa)</Link>
        <Link to='/product-type' className="side-nav">Types</Link>
        <Link to='/product-category' className="side-nav">Categories</Link>
        <Link to='/attributes' className="side-nav">Attributes</Link>
        <Link to='/products' className="side-nav">Products</Link>
        <Link to='/inventory' className="side-nav">Inventory</Link>
        <Link to='/banks' className="side-nav">Banks</Link>
        <Link to='/stores' className="side-nav">Stores</Link>
        <Link to='/shipping' className="side-nav">Shipping</Link>
        <Link to='/payment' className="side-nav">Payment</Link>
        <Link to='/admin/orders' className="side-nav">Orders</Link>
        <Link to='/transactions' className="side-nav">Transactions</Link>
      </aside>
      <div className="content">
        <header>
          <div>
            Header Modules
          </div>

          <div>
            {user && user.name} &nbsp; &nbsp;
            <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
          </div>
        </header>
        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}
