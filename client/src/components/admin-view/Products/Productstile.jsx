import React from "react";

const AdminProductTile = ({
  product,
  setFormData,
  setIsDrawerOpen,
  setCurrentEditedId,
  handleDelete,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow">
      <div>
        <div className="relative">
          <img
            src={product?.images?.[0]}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.name}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className="
               text-lg font-semibold text-primary"
            >
              ₦{product?.price}
            </span>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center border-t">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
              setCurrentEditedId(product?.product_id);
              setFormData(product);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product?.product_id)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductTile;
