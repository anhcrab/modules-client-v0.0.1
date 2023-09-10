import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
// import img from '../assets/logo-pis.png'

const Products = () => {
    const [products, setProducts] = useState([]);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext()

    useEffect(() => {
        getProducts();
        axiosClient.get('/types').then(res => setTypes(res.data))
        axiosClient.get('/product-categories').then(res => setCategories(res.data))
        axiosClient.get('/product-attributes').then(res => setAttributes(res.data))
    }, [])

    const onDeleteClick = product => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }
        axiosClient.delete(`/products/${product.id}`)
            .then(() => {
                setNotification('Product was successfully deleted')
                getProducts()
            })
    }

    const getProducts = () => {
        setLoading(true)
        axiosClient.get('/products')
            .then(({ data }) => {
                console.log(data);
                setLoading(false)
                setProducts(data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <h1>Products</h1>
                <div>
                    <Link className="btn-add" to="/products/new">Add new</Link>
                    <button className="btn-add">Export</button>
                </div>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Attibute</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" class="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {products && products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.type}</td>
                                    <td>
                                        <img
                                            src={p.images}
                                            alt="product-icon"
                                            style={{
                                                height: '60px',
                                                width: '60px',
                                            }}
                                        />
                                    </td>
                                    <td>{p.name}</td>
                                    <td>{p.sale_price ? p.sale_price : p.regular_price}</td>
                                    <td>{p.category && p.category}</td>
                                    <td>{p.attributes && p.attributes.map((a, i, p) => {
                                        if (i + 1 === p.length) {
                                            return `${a.name}`
                                        }
                                        return `${a.name}, `
                                    })}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/products/' + p.id}>Edit</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={ev => onDeleteClick(p)}>Delete</button>
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

export default Products
