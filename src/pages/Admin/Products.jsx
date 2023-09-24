import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";
// import img from '../assets/logo-pis.png'

const Products = () => {
    const [products, setProducts] = useState([]);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext()
    const { t } = useTranslation('admin')

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
                <h1>{t('product.products.title')}</h1>
                <div>
                    <Link className="btn-add" to="/products/new">{t('product.products.table.add')}</Link>
                    {/* <button className="btn-add">{t('product.products.table.export')}</button> */}
                </div>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('product.products.table.type')}</th>
                            <th>{t('product.products.table.image')}</th>
                            <th>{t('product.products.table.name')}</th>
                            <th>{t('product.products.table.price')}</th>
                            <th>{t('product.products.table.category')}</th>
                            <th>{t('product.products.table.attribute')}</th>
                            <th>{t('product.products.table.actions')}</th>
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
                                        <Link className="btn-edit" to={'/products/' + p.id}>{t('product.products.table.edit')}</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={ev => onDeleteClick(p)}>{t('product.products.table.delete')}</button>
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
