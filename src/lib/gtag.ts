// lib/gtag.ts

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-LWFGMF167K";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Gửi pageview đến GA
export const pageview = (url: string) => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Gửi sự kiện tuỳ chỉnh (optional)
type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// ---------- eCommerce specific ----------

export const viewItem = (item: {
  id: string;
  name: string;
  category?: string;
  price?: number;
}) => {
  window.gtag("event", "view_item", {
    items: [item],
  });
};

export const addToCartGA = (item: {
  id: string;
  name: string;
  category?: string;
  price?: number;
  quantity?: number;
}) => {
  window.gtag("event", "add_to_cart", {
    currency: "VND",
    value: item.price ? item.price * (item.quantity || 1) : 0,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity || 1,
      },
    ],
  });
};

type GTagItem = {
  id: string;
  name: string;
  category?: string;
  price?: number;
  quantity?: number;
};

export const beginCheckout = (items: GTagItem[]) => {
  window.gtag("event", "begin_checkout", {
    items,
  });
};

export const purchase = (data: {
  transaction_id?: string;
  value?: number;
  currency?: string;
  items?: GTagItem[];
}) => {
  window.gtag("event", "purchase", data);
};

export const viewItemList = ({
  item_list_name,
  items,
}: {
  item_list_name: string;
  items: {
    id: string;
    name: string;
    category?: string;
    price?: number;
    index?: number;
  }[];
}) => {
  window.gtag("event", "view_item_list", {
    item_list_name,
    items,
  });
};

export const removeFromCartGA = (item: GTagItem) => {
  window.gtag("event", "remove_from_cart", {
    items: [item],
  });
};

export const searchGA = (searchTerm: string) => {
  window.gtag("event", "search", {
    search_term: searchTerm,
  });
};

export const selectPromotion = (promotion: {
  id?: string;
  name: string;
  creative_name?: string;
  creative_slot?: string;
}) => {
  window.gtag("event", "select_promotion", {
    promotions: [promotion],
  });
};

export {};
