import React from "react";
import SearchProduct from "./SearchProduct";

export default function SearchContainer({ result, state }) {
  console.log("search container:");
  console.log(result);
  return (
    <div
      style={{
        display: state === true ? "block" : "none",
        position: "absolute",
        backgroundColor: "#fff",
        width: "480px",
        minHeight: "200px",
        paddingTop: "15px",
      }}
    >
      {result &&
        result.map((product) => {
          return (
            <SearchProduct
              img={product.images}
              name={product.name}
              slug={product.slug}
              price={
                product.sale_price ? product.sale_price : product.regular_price
              }
            />
          );
        })}
    </div>
  );
}
