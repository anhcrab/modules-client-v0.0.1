import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Banks() {
  const [banks, setbanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  const { t } = useTranslation('admin')

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
        <h1>{t('shop.banks.title')}</h1>
        <Link className="btn-add" to="/banks/new">{t('shop.banks.table.add')}</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>{t('shop.banks.table.name')}</th>
            <th>{t('shop.banks.table.number')}</th>
            <th>{t('shop.banks.table.actions')}</th>
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
            {banks && banks.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.number}</td>
                <td>
                  <Link className="btn-edit" to={'/banks/' + u.id}>{t('shop.banks.table.edit')}</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={() => onDeleteClick(u)}>{t('shop.banks.table.delete')}</button>
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
