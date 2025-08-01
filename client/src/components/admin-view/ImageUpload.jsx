import React, { useEffect, useRef } from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import axios from "axios";
import { Skeleton } from "@mui/material";

const ImageUpload = ({
  imageFiles,
  setImageFiles,
  uploadedImageUrls,
  setUploadedImageUrls,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  maxFiles = 5,
}) => {
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Validate file types
      const validFiles = selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      if (validFiles.length !== selectedFiles.length) {
        alert("Please select only image files");
      }

      // Combine existing files with new ones (up to maxFiles)
      const updatedFiles = [...imageFiles, ...validFiles].slice(0, maxFiles);
      setImageFiles(updatedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // Validate file types
      const validFiles = droppedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      const updatedFiles = [...imageFiles, ...validFiles].slice(0, maxFiles);
      setImageFiles(updatedFiles);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedUrls = uploadedImageUrls.filter((_, i) => i !== index);

    setImageFiles(updatedFiles);
    setUploadedImageUrls(updatedUrls);

    if (updatedFiles.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImagesToCloudinary = async () => {
    // Only upload files that haven't been uploaded yet
    const filesToUpload = imageFiles.filter(
      (_, index) => !uploadedImageUrls[index]
    );

    if (filesToUpload.length === 0) return;

    setImageLoadingState(true);

    try {
      const formData = new FormData();

      // Append each file to FormData under the same field name ("images")
      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Append new URLs to existing ones
        setUploadedImageUrls((prev) => [...prev, ...response.data.urls]);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setImageLoadingState(false);
    }
  };

  useEffect(() => {
    if (imageFiles.length > 0) {
      uploadImagesToCloudinary();
    }
  }, [imageFiles]);
  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <label className="text-lg font-semibold mb-2 block">Upload Images</label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple // Allow multiple file selection
        />

        {imageFiles.length === 0 ? (
          <label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-center justify-center h-32`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload images</span>
            <span className="text-sm text-muted-foreground mt-1">
              (Max {maxFiles} images)
            </span>
          </label>
        ) : (
          <div className="space-y-2">
            {imageLoadingState ? (
              <div className="space-y-2">
                {imageFiles.map((_, index) => (
                  <Skeleton
                    key={index}
                    className="bg-gray-100 h-[72px]"
                    animation="wave"
                  />
                ))}
              </div>
            ) : (
              imageFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center">
                    <FileIcon className="w-6 text-primary mr-2 h-6" />
                    <p className="text-sm font-medium truncate max-w-[180px]">
                      {file.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="w-4 h-4" />
                    <span className="sr-only">Remove File</span>
                  </button>
                </div>
              ))
            )}
            {imageFiles.length < maxFiles && !isEditMode && (
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground cursor-pointer mt-2"
              >
                <span>+ Add more images</span>
              </label>
            )}
          </div>
        )}
      </div>

      {uploadedImageUrls.length > 0 && (
        <div className="mt-2 text-sm text-green-600">
          {uploadedImageUrls.length} image(s) ready for upload
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
