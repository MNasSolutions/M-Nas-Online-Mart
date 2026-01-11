// Export utility functions for CSV/Excel downloads

export interface ExportColumn {
  key: string;
  header: string;
  formatter?: (value: any) => string;
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create header row
  const headers = columns.map(col => col.header);
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      if (col.formatter) {
        return escapeCSVValue(col.formatter(value));
      }
      return escapeCSVValue(value);
    });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Predefined export configurations
export const userExportColumns: ExportColumn[] = [
  { key: 'full_name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'role', header: 'Role' },
  { key: 'created_at', header: 'Joined Date', formatter: (val) => val ? new Date(val).toLocaleDateString() : '' },
];

export const orderExportColumns: ExportColumn[] = [
  { key: 'order_number', header: 'Order Number' },
  { key: 'customer_name', header: 'Customer Name' },
  { key: 'customer_email', header: 'Customer Email' },
  { key: 'customer_phone', header: 'Customer Phone' },
  { key: 'total_amount', header: 'Total Amount', formatter: (val) => `₦${Number(val || 0).toLocaleString()}` },
  { key: 'payment_status', header: 'Payment Status' },
  { key: 'order_status', header: 'Order Status' },
  { key: 'shipping_address', header: 'Shipping Address' },
  { key: 'created_at', header: 'Order Date', formatter: (val) => val ? new Date(val).toLocaleDateString() : '' },
];

export const salesExportColumns: ExportColumn[] = [
  { key: 'order_number', header: 'Order Number' },
  { key: 'customer_name', header: 'Customer' },
  { key: 'total_amount', header: 'Sale Amount', formatter: (val) => `₦${Number(val || 0).toLocaleString()}` },
  { key: 'commission_amount', header: 'Commission', formatter: (val) => `₦${Number(val || 0).toLocaleString()}` },
  { key: 'seller_amount', header: 'Seller Amount', formatter: (val) => `₦${Number(val || 0).toLocaleString()}` },
  { key: 'payment_method', header: 'Payment Method' },
  { key: 'payment_status', header: 'Payment Status' },
  { key: 'created_at', header: 'Date', formatter: (val) => val ? new Date(val).toLocaleDateString() : '' },
];

export const sellerExportColumns: ExportColumn[] = [
  { key: 'business_name', header: 'Business Name' },
  { key: 'brand_name', header: 'Brand Name' },
  { key: 'owner_name', header: 'Owner Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'total_sales', header: 'Total Sales', formatter: (val) => `₦${Number(val || 0).toLocaleString()}` },
  { key: 'commission_rate', header: 'Commission Rate', formatter: (val) => `${val || 15}%` },
  { key: 'is_active', header: 'Status', formatter: (val) => val ? 'Active' : 'Inactive' },
  { key: 'created_at', header: 'Joined Date', formatter: (val) => val ? new Date(val).toLocaleDateString() : '' },
];
