// import { Button } from "@/components/ui/button";

// import { addProductFormElements } from "@/config";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminProductTile from "../../components/admin-view/Products/Productstile";
import { Drawer } from "@mui/material";
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
    image_url: null,
    image__url: null,
    price: "",
    stock_quantity: "",
    category: "",
    sub_category: "",
  };
  //   const [openCreateProductsDialog, setOpenCreateProductsDialog] =
  //     useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
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

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
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
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </div>
      </MuiDrawer>
    </Fragment>
  );
};

export default AdminProducts;
