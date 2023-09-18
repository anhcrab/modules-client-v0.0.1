import { useContext, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { StateContext } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import SearchContainer from "./SearchContainer";

const ShopHeader = ({ cartState, setCartState }) => {
    const [cart, setCart] = useState({});
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const { hide, setHide } = useContext(StateContext);
    const [products, setProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [searchContainer, setSearchContainer] = useState(false);

    useEffect(() => {
        axiosClient
            .get(`/carts/${window.localStorage.getItem("device")}`)
            .then((res) => {
                console.log(res);
                setCart(res.data);
                let result = 0;
                res.data.items &&
                    res.data.items.forEach((item) => {
                        result += item.quantity;
                    });
                setCount(result);
                setTotal(
                    cart.items &&
                    cart.items.reduce((total, item) => {
                        return total + item.price * item.quantity;
                    }, 0)
                );
            });
    }, [cartState]);

    useEffect(() => {
        axiosClient.post("/products").then((res) => setProducts(res.data));
    }, []);

    useEffect(() => {
        axiosClient
            .post("/search", {
                search_keyword: searchKeyword,
            })
            .then((res) => setSearchResult(res.data));
    }, [searchKeyword]);

    return (
        <header
            className="row"
            style={{
                width: "100%",
                background: "#dd10ff",
                height: "60px",
                alignItems: "center",
            }}
        >
            <Link
                to="/shop"
                className="col-lg-2"
                style={{
                    textAlign: "center",
                    textDecoration: "none",
                    color: "white",
                }}
            >
                logo
            </Link>
            <nav
                className="col-lg-8 row"
                style={{
                    display: "flex",
                    textDecoration: "none",
                    color: "white",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Link
                    to="/shop"
                    style={{
                        width: "50px",
                        textDecoration: "none",
                        color: "white",
                    }}
                >
                    shop
                </Link>
                <div style={{ width: "50px" }}>about</div>
                <div style={{ width: "50px" }}>news</div>
                <Link
                    to="/"
                    style={{
                        width: "50px",
                        textDecoration: "none",
                        color: "white",
                    }}
                >
                    home
                </Link>
                <div style={{ width: "50px" }}>contact</div>
                <div
                    style={{
                        position: "relative",
                        width: "500px",
                        marginLeft: "140px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                            if (e.target.value === "") {
                                setSearchContainer(false);
                            } else {
                                setSearchContainer(true);
                            }
                        }}
                        style={{
                            // width: "500px",
                            // marginLeft: "140px",
                        }}
                    />
                    <SearchContainer result={searchResult} state={searchContainer} />
                </div>
            </nav>
            <div
                className="col-lg-2"
                style={{
                    cursor: "pointer",
                    position: "relative",
                }}
            >
                <span
                    onClick={() => {
                        setHide(!hide);
                    }}
                >
                    Cart: {count}
                </span>
                <div
                    className={`cart-box row ${hide ? "hidden" : ""}`}
                    style={{
                        width: "450px",
                        position: "absolute",
                        right: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 10
                    }}
                >
                    {cart.items &&
                        cart.items.map((item) => (
                            <div
                                className=""
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    margin: "10px 0",
                                    justifyContent: "space-between",
                                }}
                            >
                                <img src={item.images} style={{ width: "50px" }} />
                                <h5>{item.name}</h5>
                                <div>
                                    <button
                                        onClick={() => {
                                            axiosClient
                                                .post("/carts/add", {
                                                    device: window.localStorage.getItem("device"),
                                                    product_id: item.product_id,
                                                    quantity: item.quantity + 1,
                                                })
                                                .then((res) => {
                                                    console.log(res);
                                                    setCartState(!cartState);
                                                })
                                                .catch((err) => console.log(err));
                                        }}
                                    >
                                        +
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => {
                                            axiosClient
                                                .post("/carts/add", {
                                                    device: window.localStorage.getItem("device"),
                                                    product_id: item.product_id,
                                                    quantity: item.quantity - 1,
                                                })
                                                .then((res) => {
                                                    console.log(res);
                                                    setCartState(!cartState);
                                                })
                                                .catch((err) => console.log(err));
                                        }}
                                    >
                                        -
                                    </button>
                                </div>
                                <span>{item.price}đ</span>
                                <button
                                    style={{
                                        width: "50px",
                                    }}
                                    onClick={() => {
                                        axiosClient.post("/carts/remove", {
                                            device: window.localStorage.getItem("device"),
                                            product_id: item.product_id,
                                        });
                                    }}
                                >
                                    xóa
                                </button>
                            </div>
                        ))}
                    <span>Tổng tiền: {total}</span>
                    <Link
                        to={`/checkout/${window.localStorage.getItem("device")}`}
                        style={{
                            textAlign: "center",
                        }}
                    >
                        Thanh toán
                    </Link>
                </div>{" "}
                <Link
                    to="/orders"
                    style={{
                        width: "50px",
                        textDecoration: "none",
                        color: "white",
                    }}
                >
                    orders
                </Link>
            </div>
        </header>
    );
};

export default ShopHeader;
