import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Coupons() {
  const [coupons, setcoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation('admin')

  useEffect(() => {
    getcoupons();
  }, []);

  const onDeleteClick = (coupons) => {
    if (!window.confirm("Are you sure you want to delete this coupons?"))
      return;

    axiosClient.delete(`/coupons/${coupons.id}`).then(() => {
      setNotification("coupons was successfully deleted");
      getcoupons();
    });
  };

  const getcoupons = () => {
    setLoading(true);
    axiosClient
      .get("/coupons")
      .then(({ data }) => {
        setLoading(false);
        setcoupons(data);
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
        <h1>{t('coupons.title')}</h1>
        <Link className="btn-add" to="/coupons/new">
          {t('coupons.table.add')}
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('coupons.table.code')}</th>
              <th>{t('coupons.table.name')}</th>
              <th>{t('coupons.table.description')}</th>
              <th>{t('coupons.table.max_uses')}</th>
              <th>{t('coupons.table.max_uses_user')}</th>
              <th>{t('coupons.table.type')}</th>
              <th>{t('coupons.table.discount')}</th>
              <th>{t('coupons.table.min')}</th>
              <th>{t('coupons.table.status')}</th>
              <th>{t('coupons.table.starts')}</th>
              <th>{t('coupons.table.expires')}</th>
              <th>{t('coupons.table.actions')}</th>
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
              {coupons &&
                coupons.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.code}</td>
                    <td>{u.name}</td>
                    <td dangerouslySetInnerHTML={{ __html: u.description}}></td>
                    <td>{u.max_uses}</td>
                    <td>{u.max_uses_user}</td>
                    <td>{u.type}</td>
                    <td>{u.discount_amount}</td>
                    <td>{u.min_amount}</td>
                    <td>{u.status}</td>
                    <td>{u.starts_at}</td>
                    <td>{u.expires_at}</td>
                    <td>
                      <Link className="btn-edit" to={"/coupons/" + u.id}>
                        {t('coupons.table.edit')}
                      </Link>
                      &nbsp;
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteClick(u)}
                      >
                        {t('coupons.table.delete')}
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
