import React from "react";

const AdminProductTile = ({
  product,
  setFormData,
  setIsDrawerOpen,
  setCurrentEditedId,
  handleDelete,
}) => {
  return (
    // <Card className="w-full max-w-sm mx-auto">
    //   <div>
    //     <div className="relative">
    //       <img
    //         src={product?.image}
    //         alt={product?.title}
    //         className="w-full h-[300px] object-cover rounded-t-lg"
    //       />
    //     </div>
    //     <CardContent>
    //       <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
    //       <div className="flex justify-between items-center mb-2">
    //         <span
    //           className={`${
    //             product?.salePrice > 0 ? "line-through" : ""
    //           } text-lg font-semibold text-primary`}
    //         >
    //           ${product?.price}
    //         </span>
    //         {product?.salePrice > 0 ? (
    //           <span className="text-lg font-bold">${product?.salePrice}</span>
    //         ) : null}
    //       </div>
    //     </CardContent>
    //     <CardFooter className="flex justify-between items-center">
    //       <Button
    //         onClick={() => {
    //           setOpenCreateProductsDialog(true);
    //           setCurrentEditedId(product?._id);
    //           setFormData(product);
    //         }}
    //       >
    //         Edit
    //       </Button>
    //       <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
    //     </CardFooter>
    //   </div>
    // </Card>

    <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow">
      <div>
        <div className="relative">
          <img
            src={product?.image_url}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className="
               text-lg font-semibold text-primary"
            >
              ${product?.price}
            </span>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center border-t">
          <button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product?._id)}
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
