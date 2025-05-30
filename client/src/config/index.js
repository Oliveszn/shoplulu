export const registerFormControls = [
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter your User Name",
    componentType: "input",
    type: "text",
  },

  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter your User Name",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter product name",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    label: "Sub Category",
    name: "sub_category",
    componentType: "select",
    options: [], //was filled in dynamically wit subcat
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },

  {
    label: "Total Stock",
    name: "stock_quantity",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const subCategoriesByCategory = {
  men: [
    { id: "tees", label: "Tees" },
    { id: "shirt", label: "Shirt" },
    { id: "pants", label: "Pants" },
    { id: "denim", label: "Denim" },
    { id: "hoodies", label: "Hoodies" },
  ],
  women: [
    { id: "gown", label: "Gown" },
    { id: "skirt", label: "Skirt" },
    { id: "top", label: "Top" },
    { id: "short", label: "Short" },
  ],
  accessories: [
    { id: "hat", label: "Hat" },
    { id: "bag", label: "Bag" },
  ],
};
