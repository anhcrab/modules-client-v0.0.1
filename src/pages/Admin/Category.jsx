import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Categories() {
  const [categories, setcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  const { t } = useTranslation('admin')

  useEffect(() => {
    getcategories();
  }, [])

  const onDeleteClick = user => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/categories/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getcategories()
      })
  }

  const getcategories = () => {
    setLoading(true)
    axiosClient.get('/categories')
      .then(({ data }) => {
        setLoading(false)
        setcategories(data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>{t('product.categories.title')}</h1>
        <Link className="btn-add" to="/product-category/new">{t('product.categories.table.add')}</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>{t('product.categories.table.parent_id')}</th>
            <th>{t('product.categories.table.name')}</th>
            <th>{t('product.categories.table.slug')}</th>
            <th>{t('product.categories.table.actions')}</th>
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
            {categories && categories.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.category_id}</td>
                <td>{u.name}</td>
                <td>{u.slug}</td>
                <td>
                  <Link className="btn-edit" to={'/product-category/' + u.id}>{t('product.categories.table.edit')}</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>{t('product.categories.table.delete')}</button>
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
