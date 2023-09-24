import { useState } from "react";
import ShopHeader from "../../components/ShopHeader";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("contact");
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <ShopHeader />
      <main
        style={{
          minHeight: "92vh",
          background: "linear-gradient(180deg, #92b9ba 50%, #ffffff 50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "1200px",
            minHeight: "600px",
            boxShadow: "1px 1px 25px",
            justifyContent: "space-between",
          }}
        >
          <form
            style={{
              width: "70%",
              backgroundColor: "#fff",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              axiosClient.post("/contacts", form).then((res) => {
                console.log(res.data);
                navigate("/shop");
              });
            }}
          >
            <h2>{t("form.title")}</h2>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <label htmlFor="fname" style={{ width: "50%" }}>
                {t("form.fname")}:
                <input
                  type="text"
                  id="fname"
                  name="firstname"
                  onChange={handleOnChange}
                />
              </label>
              <label htmlFor="lname" style={{ width: "50%" }}>
                {t("form.lname")}:
                <input
                  type="text"
                  id="lname"
                  name="lastname"
                  onChange={handleOnChange}
                />
              </label>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <label htmlFor="email" style={{ width: "50%" }}>
                {t('table.email')}:
                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={handleOnChange}
                />
              </label>
              <label htmlFor="phone" style={{ width: "50%" }}>
                {t('table.phone')}:
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  onChange={handleOnChange}
                />
              </label>
            </div>
            <label htmlFor="subject">
              {t('table.subject')}:
              <input
                type="text"
                id="subject"
                name="subject"
                onChange={handleOnChange}
              />
            </label>
            <label htmlFor="message" style={{ width: "100%" }}>
              {t('table.message')}:
              <textarea
                id="message"
                style={{
                  width: "100%",
                  height: "150px",
                  outline: "none",
                  border: "2px solid #dedede",
                }}
                name="message"
                onChange={handleOnChange}
              ></textarea>
            </label>
            <button
              type="submit"
              style={{
                width: "200px",
                padding: "10px",
                outline: "none",
                border: 0,
                borderRadius: "25px",
                color: "#fff",
                backgroundColor: "#39487a",
              }}
            >
              {t('form.send')}
            </button>
          </form>
          <div
            style={{
              backgroundColor: "#39487a",
              width: "30%",
              padding: "30px",
              color: "#fff",
            }}
          >
            <h5>{t('info.title')}</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
