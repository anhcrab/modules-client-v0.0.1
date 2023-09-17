import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function Attributes() {
  const [attributes, setattributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getattributes();
  }, [])

  const onDeleteClick = (attributes) => {
    if (!window.confirm("Are you sure you want to delete this attributes?")) return
    
    axiosClient.delete(`/attributes/${attributes.id}`)
      .then(() => {
        setNotification('attributes was successfully deleted')
        getattributes()
      })
  }

  const getattributes = () => {
    setLoading(true)
    axiosClient.get('/attributes')
      .then(({ data }) => {
        setLoading(false)
        setattributes(data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>attributes</h1>
        <Link className="btn-add" to="/attributes/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {attributes && attributes.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.type}</td>
                <td>{u.name}</td>
                <td>{u.code}</td>
                <td>
                  <Link className="btn-edit" to={'/attributes/' + u.id}>Edit</Link>
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
