import type { UploadFile } from "antd";
import type { UploadChangeParam } from "antd/lib/upload";

export type UploadResponse = UploadChangeParam<UploadFile>;

export type AccountForm = {
  account_name: string;
  owner_name: string;
  owner_email: string;
  country: string;
  address: string;
  phone: string;
  logo: string;
};

export interface Logo {
  name: string;
  url: string;
  size: number;
  uid: string;
}

export type Account = {
  id: string;
  createdDate: string;
  updatedDate: string;
  logo?: string;
  invoices?: Invoice[];
  clients?: Client[];
} & Omit<AccountForm, "logo">;

export type Client = {
  id: string;
  client_name: string;
  client_email: string;
  country: string;
  address: string;
  phone: string;
  createdDate: string;
  updatedDate: string;
  invoices?: Invoice[];
  account: Account;
  userId: string;
};

export type Invoice = {
  id: string;
  invoice_name: string;
  invoiceDate: string;
  discount: number;
  tax: number;
  custom_id: string;
  services: Service[];
  subtotal: number;
  total: number;
  createdDate: string;
  updatedDate: string;
  account: Account;
  client: Client;
  note: string;
  currency: string;
  status: string;
};

export type Service = {
  title: string;
  description: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  totalPrice: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  address: string;
  phone_number: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdDate: string;
  updatedDate: string;
};

export type IEvent = {
  id: number;
  event_name: string;
  phone: number;
  date: string;
  agenda: string;
  status: "new" | "done" | "cancelled";
}
export type ClientMedia = {
  id: number;
  client: Client;
  phone: number;
  date: string;
  agenda: string;
  status: "new" | "done" | "cancelled";
}


export type Media = {
  id: string;
  name: string;
  alternativeText: any;
  caption: any;
  width: number;
  height: number;
  formats: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  createdDate: string;
  updatedDate: string;
};

export type SimplifiedInvoice = {
  id: string;
  invoice_name: string;
  invoiceDate: string;
  total: number;
  client: Client;
  account: Account;
  note?: string;
  currency: string;
  status: string;
  // Add any other fields specific to simplified invoices
};

export type StandardInvoice = {
  id: string;
  invoice_name: string;
  invoiceDate: string;
  discount: number;
  tax: number;
  custom_id: string;
  services: Service[];
  subtotal: number;
  total: number;
  createdDate: string;
  updatedDate: string;
  account: Account;
  client: Client;
  note: string;
  currency: string;
  status: string;
  // Add any other fields specific to standard invoices
};
