import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Type() {
  const [types, settypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation('admin')

  useEffect(() => {
    gettypes();
  }, []);

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient.delete(`/types/${user.id}`).then(() => {
      setNotification("User was successfully deleted");
      gettypes();
    });
  };

  const gettypes = () => {
    setLoading(true);
    axiosClient
      .get("/types")
      .then(({ data }) => {
        setLoading(false);
        settypes(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{t('product.types.title')}</h1>
        <Link className="btn-add" to="/product-type/new">
          {t('product.types.table.add')}
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('product.types.table.name')}</th>
              <th>{t('product.types.table.actions')}</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {types &&
                types.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>
                      <Link className="btn-edit" to={"/product-type/" + u.id}>
                        {t('product.types.table.edit')}
                      </Link>
                      &nbsp;
                      <button
                        className="btn-delete"
                        onClick={(ev) => onDeleteClick(u)}
                      >
                        {t('product.types.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
