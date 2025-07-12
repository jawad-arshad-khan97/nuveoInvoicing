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
  Row,
  Col,
  Upload,
} from "antd";
import { PlusCircleOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { saudiDistricts } from "@/utils/saudiDistricts";

const sectionStyle = { background: '#fafbfc', borderRadius: 8, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px #eee' };
const sectionTitleStyle = { marginBottom: 16, fontWeight: 600, fontSize: 18 };

export const StandardInvoiceForm: React.FC = () => {
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

  useEffect(() => {
    form.setFieldsValue({
      subtotal: subtotal,
      vatAmount: totalVAT,
      grandTotal: grandTotal,
    });
  }, [subtotal, totalVAT, grandTotal, form]);

  return (
    <Card title={<Typography.Title level={3}>📄 Standard Invoice (B2B)</Typography.Title>} bordered style={{ maxWidth: 1100, margin: "32px auto", background: '#f5f7fa' }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={(v) => {
          // Attach line items and totals to form values
          console.log("Standard Invoice:", { ...v, lineItems, subtotal, totalVAT, grandTotal });
        }}
      >
        {/* Seller Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Seller Details</div>
          <Row gutter={24}>
            <Col span={8}><Form.Item label="Seller Name" name="sellerName" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Seller VAT Number" name="sellerVAT" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Commercial Registration (CR) Number" name="sellerCR" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}><Form.Item label="Contact Information" name="sellerContact" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="Business Category/Activity" name="businessCategory" rules={[{ required: true }]}>
              <Select placeholder="Select category">
                <Select.Option value="Sole Proprietorship">Sole Proprietorship</Select.Option>
                <Select.Option value="Partnership">Partnership</Select.Option>
                <Select.Option value="Corporation">Corporation</Select.Option>
              </Select>
            </Form.Item></Col>
          </Row>
          {/* Seller Address Section - REMOVE sellerAddress field, keep all address fields in one row */}
          <Row gutter={24}>
            <Col span={4}><Form.Item label="Building Number" name="sellerBuildingNumber" rules={[{ required: true }]}><Input maxLength={4} /></Form.Item></Col>
            <Col span={5}><Form.Item label="Street Name" name="sellerStreetName" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={5}><Form.Item label="District" name="sellerDistrict" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children" placeholder="Select district">
                {saudiDistricts.map((d) => <Select.Option key={d} value={d}>{d}</Select.Option>)}
              </Select>
            </Form.Item></Col>
            <Col span={5}><Form.Item label="City" name="sellerCity" rules={[{ required: true }]}><Input style={{ textTransform: "lowercase" }} /></Form.Item></Col>
            <Col span={5}><Form.Item label="ZIP Code" name="sellerZip" rules={[{ required: true }]}><Input maxLength={5} /></Form.Item></Col>
          </Row>
        </div>
        {/* Seller Proof & Bank Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Ownership & Banking</div>
          <Row gutter={24}>
            <Col span={8}><Form.Item label="Ownership and Investment Proof" name="ownershipProof" valuePropName="fileList" getValueFromEvent={e => e && e.fileList} rules={[{ required: true }]}>
              <Upload beforeUpload={() => false} maxCount={1}><Button icon={<UploadOutlined />}>Choose File</Button></Upload>
            </Form.Item></Col>
            <Col span={8}><Form.Item label="Identification Documents" name="identificationDocs" valuePropName="fileList" getValueFromEvent={e => e && e.fileList} rules={[{ required: true }]}>
              <Upload beforeUpload={() => false} maxCount={1}><Button icon={<UploadOutlined />}>Choose File</Button></Upload>
            </Form.Item></Col>
            <Col span={8}><Form.Item label="Articles of Association (AoA) & MoA" name="aoaMoa" valuePropName="fileList" getValueFromEvent={e => e && e.fileList} rules={[{ required: true }]}>
              <Upload beforeUpload={() => false} maxCount={1}><Button icon={<UploadOutlined />}>Choose File</Button></Upload>
            </Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}><Form.Item label="Bank Name" name="bankName" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Account No" name="bankAccountNo" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="IFSC Code" name="ifscCode" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}><Form.Item label="Financial Statements or Forecasts" name="financialStatements" valuePropName="fileList" getValueFromEvent={e => e && e.fileList} rules={[{ required: true }]}>
              <Upload beforeUpload={() => false} maxCount={1}><Button icon={<UploadOutlined />}>Choose File</Button></Upload>
            </Form.Item></Col>
          </Row>
        </div>
        {/* Invoice Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Invoice Details</div>
          <Row gutter={24}>
            <Col span={8}><Form.Item label="Invoice Number" name="invoiceNumber" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
            <Col span={8}><Form.Item label="Currency" name="currency" initialValue="SAR" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
        </div>
        {/* Buyer Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Buyer Details</div>
          <Row gutter={24}>
            <Col span={12}><Form.Item label="Buyer Name" name="buyerName" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="Buyer VAT Number" name="buyerVAT" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}><Form.Item label="Building Number" name="buyerBuildingNumber" rules={[{ required: true }]}><Input maxLength={4} /></Form.Item></Col>
            <Col span={5}><Form.Item label="Street Name" name="buyerStreetName" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={5}><Form.Item label="District" name="buyerDistrict" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children" placeholder="Select district">
                {saudiDistricts.map((d) => <Select.Option key={d} value={d}>{d}</Select.Option>)}
              </Select>
            </Form.Item></Col>
            <Col span={5}><Form.Item label="City" name="buyerCity" rules={[{ required: true }]}><Input style={{ textTransform: "lowercase" }} /></Form.Item></Col>
            <Col span={5}><Form.Item label="ZIP Code" name="buyerZip" rules={[{ required: true }]}><Input maxLength={5} /></Form.Item></Col>
          </Row>
        </div>
        {/* Line Items Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Line Items</div>
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
        </div>
        {/* Invoice Metadata Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Invoice Metadata</div>
          <Row gutter={24}>
            <Col span={8}><Form.Item label="Subtotal (excl. VAT)" name="subtotal" rules={[{ required: true }]}><InputNumber min={0} readOnly /></Form.Item></Col>
            <Col span={8}><Form.Item label="VAT Amount" name="vatAmount" rules={[{ required: true }]}><InputNumber min={0} readOnly /></Form.Item></Col>
            <Col span={8}><Form.Item label="Grand Total (incl. VAT)" name="grandTotal" rules={[{ required: true }]}><InputNumber min={0} readOnly /></Form.Item></Col>
          </Row>
        </div>
        {/* UUID & Signature Section */}
        <div style={sectionStyle}>
          <Row gutter={24}>
            <Col span={12}><Form.Item label="UUID" name="uuid" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="Digital Signature" name="signature" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item></Col>
          </Row>
        </div>
        <Button type="primary" htmlType="submit" size="large" style={{ marginTop: 16, width: 200, float: 'right' }}>Generate Standard Invoice</Button>
      </Form>
    </Card>
  );
};
