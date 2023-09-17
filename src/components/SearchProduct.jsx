import React from 'react'
import { Link } from 'react-router-dom'

export default function SearchProduct({ slug, img, name, price }) {
  return (
    <Link 
    to={'/shop/' + slug}
    style={{
      backgroundColor: '#eee',
      color: '#555',
      border: '1px solid #eee',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      textDecoration: 'none',
      padding: '20px'
    }}>
      <img src={img} alt="ảnh sản phẩm" />
      <p>{name}</p>
      <p>{price} đ</p>
    </Link>
  )
}
