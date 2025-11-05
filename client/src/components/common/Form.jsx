import React from "react";
import { subCategoriesByCategory } from "../../config";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
  //first two funcs is written to dynamically alter subcat i dont understand but will come later
  // Get current subcategories based on selected category
  const getCurrentSubcategories = () => {
    if (!formData.category) return [];
    return subCategoriesByCategory[formData.category] || [];
  };

  // Update form controls with dynamic subcategories
  const updatedFormControls = formControls.map((control) => {
    if (control.name === "sub_category") {
      return {
        ...control,
        options: getCurrentSubcategories(),
      };
    }
    return control;
  });

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    switch (getControlItem.componentType) {
      case "input":
        element = (
          <input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "select":
        element = (
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          >
            <option value="" disabled>
              {getControlItem.label}
            </option>
            {getControlItem.options && getControlItem.options.length > 0
              ? getControlItem.options.map((optionItem) => (
                  <option key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </option>
                ))
              : null}
          </select>
        );
        break;

      case "textarea":
        element = (
          <textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
          />
        );
        break;
    }
    return element;
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-3 ">
          {updatedFormControls.map((controlItem) => (
            <div className="grid w-full gap-2" key={controlItem.name}>
              <label className="mb-1">{controlItem.label}</label>
              {renderInputsByComponentType(controlItem)}
            </div>
          ))}
        </div>
        <button
          disabled={isBtnDisabled}
          type="submit"
          className="mt-2 w-full bg-gray-300 cursor-pointer border border-slate-200 shadow-sm"
        >
          {buttonText || "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CommonForm;
