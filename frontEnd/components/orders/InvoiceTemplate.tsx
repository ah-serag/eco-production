import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 50, 
    fontSize: 10, 
    fontFamily: 'Helvetica', 
    color: '#1a1a1a',
    lineHeight: 1.6 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottom: 1.5, 
    borderColor: '#000', 
    paddingBottom: 25, 
    marginBottom: 40 
  },
  brandTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 1.5 },
  orderInfo: { textAlign: 'right', gap: 5 },
  section: { 
    marginBottom: 45, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  subSection: { width: '45%' },
  sectionTitle: { 
    fontSize: 8, 
    fontWeight: 'bold', 
    color: '#888', 
    marginBottom: 12, 
    textTransform: 'uppercase', 
    letterSpacing: 1.2,
    borderBottom: 0.5, 
    borderColor: '#EEE', 
    paddingBottom: 5 
  },
  text: { marginBottom: 4 },
  boldText: { fontWeight: 'bold', color: '#000' },
  
  // Table Styles
  table: { marginTop: 15 },
  tableHeader: { 
    backgroundColor: '#111', 
    color: '#FFF',
    flexDirection: 'row', 
    padding: 10, 
    fontWeight: 'bold',
    borderRadius: 2
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 0.5, 
    borderColor: '#eee', 
    paddingVertical: 15, // زيادة المسافة الرأسية لتناسب الوصف
    paddingHorizontal: 10,
    alignItems: 'flex-start' // محاذاة العناصر للأعلى بسبب الوصف الطويل
  },
  
  colDesc: { width: '60%', flexDirection: 'column', gap: 2 },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '25%', textAlign: 'right' },
  
  productTitle: { fontSize: 11, fontWeight: 'bold', color: '#000' },
  productDesc: { fontSize: 8, color: '#666', lineHeight: 1.3 },
  skuText: { fontSize: 7, color: '#999', marginTop: 2 },

  totalSection: { 
    marginTop: 50, 
    paddingTop: 15,
    borderTop: 1, 
    borderColor: '#eee', 
    alignItems: 'flex-end' 
  },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 20, 
    marginBottom: 8 
  },
  grandTotal: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10,
    color: '#000'
  },
  footer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 50, 
    right: 50, 
    textAlign: 'center', 
    fontSize: 8, 
    color: '#bbb', 
    borderTop: 0.5, 
    paddingTop: 15,
    lineHeight: 1.4
  }
});

export const InvoiceDocument = ({ order }: { order: any }) => {
  const shipping = order.payment_response?.order?.shipping_data || {};
  const paymentSource = order.payment_response?.source_data || {};
  const isPaid = order.is_paid || order.payment_response?.success;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>VEXA SHOP</Text>
            <Text style={{ fontSize: 9, color: '#999', marginTop: 4 }}>OFFICIAL WAREHOUSE INVOICE</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={[styles.boldText, {marginBottom: 4}]}>REF: #{order.id.slice(-8).toUpperCase()}</Text>
            <Text>Issued: {new Date(order.created_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Addresses & Payment */}
        <View style={styles.section}>
          <View style={styles.subSection}>
            <Text style={styles.sectionTitle}>Recipient</Text>
            <Text style={[styles.boldText, { fontSize: 11, marginBottom: 4 }]}>{shipping.first_name} {shipping.last_name}</Text>
            <Text style={styles.text}>{shipping.street}</Text>
            <Text style={styles.text}>{shipping.city}, {shipping.state}</Text>
            <Text style={styles.text}>M: {shipping.phone_number}</Text>
          </View>

          <View style={styles.subSection}>
            <Text style={styles.sectionTitle}>Transaction Info</Text>
            <Text style={styles.text}>Provider: <Text style={styles.boldText}>{order.payment_provider.toUpperCase()}</Text></Text>
            <Text style={styles.text}>Method: {paymentSource.sub_type || 'Card'} (**** {paymentSource.pan || 'N/A'})</Text>
            <Text style={[styles.text, { color: isPaid ? '#059669' : '#dc2626', fontWeight: 'bold', marginTop: 5 }]}>
               [{isPaid ? "PAID & VERIFIED" : "PAYMENT PENDING"}]
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Product Details</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Total</Text>
          </View>

          {order.items?.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              {/* عمود الوصف المعدل ليشمل الاسم والوصف والـ SKU */}
              <View style={styles.colDesc}>
                <Text style={styles.productTitle}>{item.product_title || 'General Product'}</Text>
                {item.product_description && (
                  <Text style={styles.productDesc}>{item.product_description}</Text>
                )}
                <Text style={styles.skuText}>SKU: {item.product_id}</Text>
              </View>

              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>
                {(item.price_at_purchase * item.quantity).toFixed(2)} {order.currency}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={{ color: '#999' }}>Subtotal</Text>
            <Text>{order.total_amount} {order.currency}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Amount Paid</Text>
            <Text>{order.total_amount} {order.currency}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer-generated document. No signature is required.</Text>
          <Text>Order ID: {order.id} | System Date: {new Date().toISOString()}</Text>
          <Text style={{ marginTop: 8, letterSpacing: 1 }}>VEXA STORE SYSTEM © 2026</Text>
        </View>

      </Page>
    </Document>
  );
};