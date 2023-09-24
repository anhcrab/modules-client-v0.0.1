import { Link, Navigate, Outlet } from "react-router-dom";
import { StateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } =
    useContext(StateContext);

  const [productNav, setProductNav] = useState(true);
  const [shopNav, setShopNav] = useState(false);
  const { t, i18n } = useTranslation(["admin", "advert", "lang"]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/auth/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/users").then(({ data }) => {
      setUser(data);
    });
  }, []);

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard" className="side-nav">
          {t("dashboard.title", { ns: "admin" })}
        </Link>
        <Link to="/users" className="side-nav">
          {t("users.title", { ns: "admin" })}
        </Link>
        <Link to="/media" className="side-nav">
          {t("media.title", { ns: "admin" })}
        </Link>
        <div
          className="dropdownMenu"
          onClick={() => {
            setProductNav(!productNav);
          }}
        >
          <div className="dropdownTitle">
            <div> {t("product.name", { ns: "admin" })}</div>
            <i
              className={`bi bi-caret-${!productNav ? "up" : "down"}-fill`}
            ></i>
          </div>
          <ul
            style={{
              display: !productNav ? "block" : "none",
              transform: "width(0) 3s",
            }}
          >
            <li>
              <Link
                to="/product-type"
                className={`side-nav ${
                  !productNav ? "animated-1 slideDown" : "animated-5 slideUp"
                } `}
              >
                {t("product.types.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link
                to="/product-category"
                className={`side-nav ${
                  !productNav ? "animated-2 slideDown" : "animated-4 slideUp"
                } `}
              >
                {t("product.categories.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link
                to="/attributes"
                className={`side-nav ${
                  !productNav ? "animated-3 slideDown" : "animated-3 slideUp"
                }`}
              >
                {t("product.attributes.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`side-nav ${
                  !productNav ? "animated-4 slideDown" : "animated-2 slideUp"
                }`}
              >
                {t("product.products.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link
                to="/inventory"
                className={`side-nav ${
                  !productNav ? "animated-5 slideDown" : "animated-1 slideUp"
                }`}
              >
                {t("product.inventories.title", { ns: "admin" })}
              </Link>
            </li>
          </ul>
        </div>
        <div className="dropdownMenu">
          <div
            className="dropdownTitle"
            onClick={() => {
              setShopNav(!shopNav);
            }}
          >
            <div>{t("shop.name", { ns: "admin" })}</div>
            <i className={`bi bi-caret-${shopNav ? "up" : "down"}-fill`}></i>
          </div>
          <ul
            style={{
              display: shopNav ? "block" : "none",
            }}
          >
            <li>
              <Link to="/banks" className="side-nav animated-1 slideDown">
                {t("shop.banks.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link to="/stores" className="side-nav animated-2 slideDown">
                {t("shop.stores.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="side-nav animated-3 slideDown">
                {t("shop.shippings.title", { ns: "admin" })}
              </Link>
            </li>
            <li>
              <Link to="/payment" className="side-nav animated-4 slideDown">
                {t("shop.payments.title", { ns: "admin" })}
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/coupons" className="side-nav">
          {t("coupons.title", { ns: "admin" })}
        </Link>
        <Link to="/admin/orders" className="side-nav">
          {t("orders.title", { ns: "admin" })}
        </Link>
        <Link to="/transactions" className="side-nav">
          {t("transactions.title", { ns: "admin" })}
        </Link>
        <Link to="/advs" className="side-nav">
          {t("heading", { ns: "advert" })}
        </Link>
        <Link to="/contacts" className="side-nav">
          {t("contact", { ns: "admin" })}
        </Link>
        {/* <Link to="/langs" className="side-nav">
          {t("heading", { ns: "lang" })}
        </Link> */}
      </aside>
      <div className="content">
        <header>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "45px",
              fontSize: '18px',
              fontWeight: '500'
            }}
          >
            <div
              onClick={() => {
                i18n.changeLanguage("en");
              }}
              style={{
                cursor: "pointer",
                textDecoration: i18n.language === 'en' ? 'underline' : 'none'
              }}
            >
              en
            </div>
            <div
              onClick={() => {
                i18n.changeLanguage("vi");
              }}
              style={{
                cursor: 'pointer',
                textDecoration: i18n.language === 'vi' ? 'underline' : 'none'
              }}
            >
              vi
            </div>
          </div>

          <div>
            {user && user.name} &nbsp; &nbsp;
            <a onClick={onLogout} className="btn-logout" href="#">
              {t("logout", { ns: "admin" })}
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}
