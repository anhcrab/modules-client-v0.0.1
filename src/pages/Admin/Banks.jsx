import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function Banks() {
  const [banks, setbanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getbanks();
  }, [])

  const onDeleteClick = (banks) => {
    if (!window.confirm("Are you sure you want to delete this banks?")) return
    
    axiosClient.delete(`/banks/${banks.id}`)
      .then(() => {
        setNotification('banks was successfully deleted')
        getbanks()
      })
  }

  const getbanks = () => {
    setLoading(true)
    axiosClient.get('/banks')
      .then(({ data }) => {
        setLoading(false)
        setbanks(data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>banks</h1>
        <Link className="btn-add" to="/banks/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Number</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {banks && banks.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.number}</td>
                <td>
                  <Link className="btn-edit" to={'/banks/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={() => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
