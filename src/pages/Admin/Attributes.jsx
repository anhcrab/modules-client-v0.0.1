import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Attributes() {
  const [attributes, setattributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  const { t } = useTranslation('admin')

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
        <h1>{t('product.attributes.title')}</h1>
        <Link className="btn-add" to="/attributes/new">{t('product.attributes.table.add')}</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>{t('product.attributes.table.type')}</th>
            <th>{t('product.attributes.table.name')}</th>
            <th>{t('product.attributes.table.code')}</th>
            <th>{t('product.attributes.table.actions')}</th>
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
                  <Link className="btn-edit" to={'/attributes/' + u.id}>{t('product.attributes.table.edit')}</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={() => onDeleteClick(u)}>{t('product.attributes.table.delete')}</button>
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
