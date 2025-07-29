import { ShoppingBag } from "lucide-react";

export default function ShoppingBagSpinner() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-900 dark:border-gray-100"></div>
        <ShoppingBag className="absolute h-12 w-12 text-gray-700 dark:text-gray-300" />
      </div>
    </div>
  );
}
