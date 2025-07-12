import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Form,
  InputNumber,
  Select,
  Button,
  DatePicker,
  Divider,
  Typography,
  Flex,
  Row,
  Col,
} from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";

export const SimplifiedInvoiceForm: React.FC = () => {
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, unitPrice: 0, vatPercent: 15 },
  ]);
  const [form] = Form.useForm();

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0, vatPercent: 15 }]);
  };
  const handleRemoveLineItem = (idx: number) => {
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };
  const handleLineItemChange = (idx: number, key: string, value: any) => {
    setLineItems(lineItems.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  // Calculate totals
  const subtotal = lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalVAT = lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity * (item.vatPercent || 0) / 100), 0);
  const grandTotal = subtotal + totalVAT;

  // Update form values when lineItems change
  useEffect(() => {
    form.setFieldsValue({
      subtotal: subtotal,
      vatAmount: totalVAT,
      grandTotal: grandTotal,
    });
  }, [subtotal, totalVAT, grandTotal, form]);

  return (
    <Card title={<Typography.Title level={3}>🧾 Simplified Invoice (B2C)</Typography.Title>} bordered style={{ maxWidth: 900, margin: "32px auto" }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={(v) => {
          // Attach line items and totals to form values
          console.log("Simplified Invoice:", { ...v, lineItems, subtotal, totalVAT, grandTotal });
        }}
      >
        <Divider orientation="left">Seller Details</Divider>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="Seller Name" name="sellerName" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item label="Seller VAT Number" name="sellerVAT" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}><Form.Item label="Seller Address" name="sellerAddress" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item></Col>
        </Row>
        <Divider orientation="left">Invoice Details</Divider>
        <Row gutter={16}>
          <Col span={8}><Form.Item label="Invoice Number" name="invoiceNumber" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
          <Col span={8}><Form.Item label="Currency" name="currency" initialValue="SAR" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>
        <Divider orientation="left">Buyer (Optional)</Divider>
        <Row gutter={16}>
          <Col span={12}><Form.Item label="Buyer Name" name="buyerName"><Input /></Form.Item></Col>
        </Row>
        <Divider orientation="left">Line Items</Divider>
        <Row gutter={16} style={{ fontWeight: 600, marginBottom: 8 }}>
          <Col span={7}>Description</Col>
          <Col span={4}>Quantity</Col>
          <Col span={5}>Unit Price (excl. VAT)</Col>
          <Col span={4}>VAT %</Col>
          <Col span={2}></Col>
        </Row>
        {lineItems.map((item, idx) => (
          <Row gutter={16} key={idx} align="middle" style={{ marginBottom: 8 }}>
            <Col span={7}><Input placeholder="Description" value={item.description} onChange={e => handleLineItemChange(idx, "description", e.target.value)} /></Col>
            <Col span={4}><InputNumber min={1} value={item.quantity} onChange={v => handleLineItemChange(idx, "quantity", v)} style={{ width: "100%" }} placeholder="Quantity" /></Col>
            <Col span={5}><InputNumber min={0} step={0.01} value={item.unitPrice} onChange={v => handleLineItemChange(idx, "unitPrice", v)} style={{ width: "100%" }} placeholder="Unit Price (excl. VAT)" /></Col>
            <Col span={4}><InputNumber min={0} max={15} step={0.5} value={item.vatPercent} onChange={v => handleLineItemChange(idx, "vatPercent", v)} style={{ width: "100%" }} placeholder="VAT %" /></Col>
            <Col span={2}>
              <Button icon={<DeleteOutlined />} danger onClick={() => handleRemoveLineItem(idx)} disabled={lineItems.length === 1} />
            </Col>
          </Row>
        ))}
        <Button icon={<PlusCircleOutlined />} type="dashed" onClick={handleAddLineItem} style={{ marginBottom: 16 }}>Add Line Item</Button>
        <Divider orientation="left">Summary</Divider>
        {/* Removed the display of Subtotal, Total VAT, Grand Total from here */}
        <Divider orientation="left">Invoice Metadata</Divider>
        <Row gutter={16}>
          <Col span={8}><Form.Item label="Subtotal (excl. VAT)" name="subtotal" rules={[{ required: true }]}><InputNumber min={0} readOnly /></Form.Item></Col>
          <Col span={8}><Form.Item label="VAT Amount" name="vatAmount" rules={[{ required: true }]}><InputNumber min={0} readOnly /></Form.Item></Col>
          <Col span={8}><Form.Item label="Grand Total (incl. VAT)" name="grandTotal" rules={[{ required: true }]}><InputNumber min={0} readOnly /></Form.Item></Col>
        </Row>
        <Form.Item label="QR Code Data (Base64)" name="qrCode"><Input.TextArea rows={3} /></Form.Item>
        <Button type="primary" htmlType="submit" size="large" style={{ marginTop: 16 }}>Generate Simplified Invoice</Button>
      </Form>
    </Card>
  );
};

