import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";

export default function Coupons() {
  const [coupons, setcoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

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
        <h1>coupons</h1>
        <Link className="btn-add" to="/coupons/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Description</th>
              <th>Max uses</th>
              <th>Max uses per user</th>
              <th>type</th>
              <th>Discount</th>
              <th>Min</th>
              <th>Status</th>
              <th>Starts</th>
              <th>Expires</th>
              <th>Actions</th>
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
                        Edit
                      </Link>
                      &nbsp;
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteClick(u)}
                      >
                        Delete
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
