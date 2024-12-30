import type { UploadFile } from "antd";
import type { UploadChangeParam } from "antd/lib/upload";

export type UploadResponse = UploadChangeParam<UploadFile>;

export type AccountForm = {
  company_name: string;
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
  id: number;
  createdDate: string;
  updatedDate: string;
  logo?: string;
  invoices?: Invoice[];
  clients?: Client[];
} & Omit<AccountForm, "logo">;

export type Client = {
  id: number;
  name: string;
  owner_name: string;
  owner_email: string;
  country: string;
  address: string;
  phone: string;
  createdDate: string;
  updatedDate: string;
  invoices?: Invoice[];
  account?: Account;
};

export type Invoice = {
  id: number;
  name: string;
  invoiceDate: string;
  discount: number;
  tax: number;
  custom_id: string;
  services: Service[];
  subTotal: number;
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
  id: number;
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

export type Media = {
  id: number;
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
