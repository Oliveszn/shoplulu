import React from "react";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
// } from "../ui/select";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
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
      //   case "select":
      // element = (
      //   <Select
      //     onValueChange={(value) =>
      //       setFormData({
      //         ...formData,
      //         [getControlItem.name]: value,
      //       })
      //     }
      //     value={value}
      //   >
      //     <SelectTrigger className="w-full">
      //       <SelectValue placeholder={getControlItem.label} />
      //     </SelectTrigger>
      //     <SelectContent>
      //       {getControlItem.options && getControlItem.options.length > 0
      //         ? getControlItem.options.map((optionItem) => (
      //             <SelectItem key={optionItem.id} value={optionItem.id}>
      //               {optionItem.label}
      //             </SelectItem>
      //           ))
      //         : null}
      //     </SelectContent>
      //   </Select>
      // );
      // break;

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
          {formControls.map((controlItem) => (
            <div className="grid w-full gap-2" key={controlItem.name}>
              <label className="mb-1">{controlItem.label}</label>
              {renderInputsByComponentType(controlItem)}
            </div>
          ))}
        </div>
        <button
          disabled={isBtnDisabled}
          type="submit"
          className="mt-2 w-full bg-red-500 cursor-pointer"
        >
          {buttonText || "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CommonForm;
