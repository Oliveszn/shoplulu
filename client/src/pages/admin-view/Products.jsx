import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminProductTile from "../../components/admin-view/Products/Productstile";
import ImageUpload from "../../components/admin-view/ImageUpload";
import { addProductFormElements } from "../../config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "../../store/admin/products-slice";
import CommonForm from "../../components/common/Form";
import MuiDrawer from "../../components/ui/MuiDrawer";

const AdminProducts = () => {
  const initialFormData = {
    name: "",
    images: [],
    price: "",
    stock: "",
    category: "",
    sub_category: "",
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]); // Changed from imageFile
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const handleFormDataChange = (name, value) => {
    setFormData((prev) => {
      // When category changes, reset sub_category
      if (name === "category") {
        return { ...prev, [name]: value, sub_category: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      images: uploadedImageUrls,
    };

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: productData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setIsDrawerOpen(false);
            setImageFiles([]);
            setCurrentEditedId(null);
          }
        })
      : dispatch(addNewProduct(productData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setIsDrawerOpen(false);
            setImageFiles([]);
            setFormData(initialFormData);
            console.log("Product add successfully");
          }
        });
  };

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <button onClick={() => setIsDrawerOpen(true)}>Add New Product</button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem, i) => (
              <AdminProductTile
                product={productItem}
                setCurrentEditedId={setCurrentEditedId}
                setIsDrawerOpen={setIsDrawerOpen}
                setFormData={setFormData}
                key={productItem.id || i}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

      {/* Drawer component */}
      <MuiDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
        anchor="right"
      >
        <div className="overflow-auto">
          <header>
            <h1>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </h1>
          </header>
          <ImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              formData={formData}
              setFormData={(newData) => setFormData(newData)}
              onSubmit={onSubmit}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
            />
          </div>
        </div>
      </MuiDrawer>
    </Fragment>
  );
};

export default AdminProducts;
