export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export const MAX_MENU_IMAGES = 5;

export type MenuItemInput = {
  itemName: string;
  category: string;
  description: string;
  price: string;
  location: string;
  images: string[];
};

export type MenuItemErrors = Partial<Record<keyof MenuItemInput, string>>;

export const emptyMenuItem: MenuItemInput = {
  itemName: "",
  category: "",
  description: "",
  price: "",
  location: "",
  images: [],
};

// Same rules as the server validator. The server is still the final check.
export function validateMenuItemInput(values: MenuItemInput): MenuItemErrors {
  const errors: MenuItemErrors = {};

  const name = values.itemName.trim();
  if (name.length < 2 || name.length > 80) {
    errors.itemName = "Item name must be 2 to 80 characters.";
  }

  if (!(MENU_CATEGORIES as readonly string[]).includes(values.category)) {
    errors.category = "Please choose a category.";
  }

  const description = values.description.trim();
  if (description.length < 10 || description.length > 1000) {
    errors.description = "Description must be 10 to 1000 characters.";
  }

  const price = Number(values.price);
  if (values.price.trim() === "" || !Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  const location = values.location.trim();
  if (location.length < 2 || location.length > 100) {
    errors.location = "Location must be 2 to 100 characters.";
  }

  if (values.images.length < 1) {
    errors.images = "Please upload at least one image.";
  }

  return errors;
}