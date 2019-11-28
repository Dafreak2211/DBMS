import React from "react";

export const AdminProducts = ({ store, onDelete, onEdit }) => {
  return (
    <div className="admin-page__products">
      <div className="admin-page__products--properties">
        <h4 className="price">Price</h4>
        <h4 className="quantity">Quantity</h4>
        <h4 className="code">Code</h4>
        <h4 className="actions">Actions</h4>
      </div>
      {/* start product */}
      {store &&
        store.map(each => (
          <div className="admin-page__product">
            <div className="admin-page__product--image">
              <img src={each.image_url} alt="" />
            </div>
            <div className="admin-page__product--name">{each.product_name}</div>
            <div className="admin-page__product--price">
              {each.price_per_unit}$
            </div>
            <div className="admin-page__product--quantity">
              {each.remaining_quantity}
            </div>
            <div className="admin-page__product--code">{each.product_id}</div>
            <div className="admin-page__product--actions">
              <a href="#" onClick={e => onEdit(e, each)}>
                <img src="/edit.svg" alt="" />
              </a>
              <a href="#" onClick={e => onDelete(e, each)}>
                <img src="/delete.svg" alt="" />
              </a>
            </div>
          </div>
        ))}
      {/* end product */}
    </div>
  );
};
