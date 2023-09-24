import { useEffect, useState } from "react";
import api from "../../axios-client.js";
import ShopHeader from "../../components/ShopHeader.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShopPage = () => {
    const [ads, setAds] = useState([]);
    const [list, setList] = useState([]);
    const [cat, setCat] = useState([]);
    const [cartState, setCartState] = useState(true);
    const [filter, setFilter] = useState({
        price: "",
        size: "",
        color: "",
    });
    const { t } = useTranslation("shop");

    useEffect(() => {
        api.get("/products").then((res) => {
            console.log(res);
            setList(res.data);
        });
        api.get("/product-categories").then((res) => setCat(res.data));
        api.get("/adverts").then((res) => setAds(res.data));
    }, []);

    useEffect(() => { console.log(ads); }, [ads]);

    const handleFilter = (e) => {
        api.get("/filter", filter).then((res) => setList(res.data));
    };

    function removeTags(str) {
        if (str === null || str === "") return '';
        else str = str.toString();
        str = str.replace(/&lt;/, "<");
        str = str.replace(/&lt;\//, "</");
        return str = str.replace(/&gt;/, ">");
    }

    return (
        <>
            <div id="ad-full">
                {ads.map((ad) => {
                    if (ad.placements === "full" && ad.status === "publish") {
                        return ad.type === "image" ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "fixed",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    zIndex: 20,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onClick={(e) => {
                                    document.getElementById("ad-full").style = "display: none;";
                                }}
                            >
                                <Link to={ad.redirect_url} style={{ zIndex: 21 }}>
                                    <img
                                        src={ad.images}
                                        style={{
                                            width: "100%",
                                        }}
                                    />
                                </Link>
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "fixed",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    zIndex: 20,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                dangerouslySetInnerHTML={{ __html: removeTags(ad.content) }}
                            ></div>
                        );
                    }
                    return "";
                })}
            </div>
            <ShopHeader />
            <main
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    paddingTop: "20px",
                }}
            >
                <aside
                    id="left-sidebar"
                    style={{
                        width: "15%",
                    }}
                >
                    {ads.map((ad) => {
                        if (ad.placements === "left" && ad.status === "publish") {
                            return ad.type === "image" ? (
                                <Link to={ad.redirect_url}>
                                    <img
                                        src={ad.images}
                                        style={{
                                            width: "100%",
                                        }}
                                    />
                                </Link>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: removeTags(ad.content) }}></div>
                            );
                        }
                        return "";
                    })}
                </aside>
                <div
                    className="container row"
                    style={{
                        display: "flex",
                        width: "70%",
                        justifyContent: "center",
                    }}
                >
                    <div id="adv-top">
                        {ads.map((ad) => {
                            if (ad.placements === "top" && ad.status === "publish") {
                                return ad.type === "image" ? (
                                    <Link to={ad.redirect_url}>
                                        <img
                                            src={ad.images}
                                            style={{
                                                width: "100%",
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: removeTags(ad.content) }}></div>
                                );
                            }
                            return "";
                        })}
                    </div>
                    <h2
                        className="row"
                        style={{
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        {t("heading")}
                    </h2>
                    <div className="filter-list">
                        <select onChange={handleFilter}>
                            <option value="">{t("filter.title")}</option>
                            <option value="">{t("filter.under")} 100.000₫</option>
                            <option value="">100.000₫ - 250.000₫</option>
                            <option value="">250.000₫ - 500.000₫</option>
                            <option value="">500.000₫ - 800.000₫</option>
                            <option value="">{t("filter.upper")} 800.000₫</option>
                        </select>
                    </div>
                    <div className="list-container row">
                        {list.map((item) => {
                            return (
                                <Link
                                    to={`/shop/${item.slug}`}
                                    className="col-lg-3"
                                    style={{
                                        alignItems: "space-between",
                                    }}
                                >
                                    <img
                                        src={item.images}
                                        style={{
                                            width: "100%",
                                        }}
                                    />
                                    <h5>{item.name}</h5>
                                    <h6>
                                        {t("price")}: {item.regular_price}đ
                                    </h6>
                                    <button>{t("look")}</button>
                                </Link>
                            );
                        })}
                    </div>
                    <div id="ad-bottom">
                        {ads.map((ad) => {
                            if (ad.placements === "bottom" && ad.status === "publish") {
                                return ad.type === "image" ? (
                                    <Link to={ad.redirect_url}>
                                        <img
                                            src={ad.images}
                                            style={{
                                                width: "100%",
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: removeTags(ad.content) }}></div>
                                );
                            }
                            return "";
                        })}
                    </div>
                </div>
                <aside
                    id="right-sidebar"
                    style={{
                        width: "15%",
                    }}
                >
                    {ads.map((ad) => {
                        if (ad.placements === "right" && ad.status === "publish") {
                            return ad.type === "image" ? (
                                <Link to={ad.redirect_url}>
                                    <img
                                        src={ad.images}
                                        style={{
                                            width: "100%",
                                        }}
                                    />
                                </Link>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: removeTags(ad.content) }}></div>
                            );
                        }
                        return "";
                    })}
                </aside>
            </main>
        </>
    );
};

export default ShopPage;
