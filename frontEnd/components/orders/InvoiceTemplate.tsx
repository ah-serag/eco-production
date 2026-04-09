import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const G = {
  black:   '#0a0a0a',
  dark:    '#111827',
  gray1:   '#374151',
  gray2:   '#6b7280',
  gray3:   '#9ca3af',
  gray4:   '#d1d5db',
  gray5:   '#f3f4f6',
  white:   '#ffffff',
  green:   '#059669',
  red:     '#dc2626',
  accent:  '#1d4ed8',
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: G.gray1,
    backgroundColor: G.white,
  },

  /* ── Top accent bar ── */
  topBar: {
    height: 4,
    backgroundColor: G.black,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 50,
    paddingTop: 36,
    paddingBottom: 30,
    backgroundColor: G.dark,
  },
  brandBlock: { flexDirection: 'column', gap: 4 },
  brandName: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 5,
    color: G.white,
  },
  brandTagline: { fontSize: 8, color: G.gray3, letterSpacing: 2 },

  invoiceBadge: {
    backgroundColor: G.white,
    color: G.dark,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  metaBlock: { flexDirection: 'column', gap: 5, alignItems: 'flex-end' },
  metaRow: { flexDirection: 'row', gap: 6 },
  metaLabel: { fontSize: 8, color: G.gray3, textTransform: 'uppercase', letterSpacing: 0.8 },
  metaValue: { fontSize: 8, fontWeight: 'bold', color: G.white },

  /* ── Status ribbon ── */
  statusRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 24,
    marginBottom: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  ribbonItem: { flexDirection: 'column', gap: 3, alignItems: 'center' },
  ribbonLabel: { fontSize: 7, color: G.gray3, textTransform: 'uppercase', letterSpacing: 0.8 },
  ribbonValue: { fontSize: 9, fontWeight: 'bold' },

  /* ── Two-column info section ── */
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginBottom: 30,
    gap: 20,
  },
  infoBox: {
    flex: 1,
    padding: 16,
    backgroundColor: G.gray5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: G.gray4,
  },
  infoBoxTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: G.gray3,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderColor: G.gray4,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  infoKey: { fontSize: 8, color: G.gray2 },
  infoVal: { fontSize: 8, fontWeight: 'bold', color: G.dark },
  infoValMono: { fontSize: 7.5, color: G.gray1, fontFamily: 'Courier' },

  /* ── Items table ── */
  tableWrap: { marginHorizontal: 50, marginBottom: 20 },
  tableTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: G.gray3,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: G.dark,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 3,
  },
  tableHeadText: { fontSize: 8, fontWeight: 'bold', color: G.white, letterSpacing: 0.5 },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: G.gray4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  tableRowAlt: { backgroundColor: '#fafafa' },

  colIdx:   { width: '6%'  },
  colDesc:  { width: '52%' },
  colQty:   { width: '10%', textAlign: 'center' },
  colUnit:  { width: '16%', textAlign: 'right' },
  colTotal: { width: '16%', textAlign: 'right' },

  itemNum:   { fontSize: 8, color: G.gray3, fontWeight: 'bold' },
  itemTitle: { fontSize: 9.5, fontWeight: 'bold', color: G.dark, marginBottom: 2 },
  itemSku:   { fontSize: 7, color: G.gray3, fontFamily: 'Courier' },

  /* ── Totals ── */
  totalsWrap: {
    marginHorizontal: 50,
    alignItems: 'flex-end',
    marginTop: 10,
  },
  totalsBox: {
    width: 240,
    borderWidth: 0.5,
    borderColor: G.gray4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderColor: G.gray4,
  },
  totalsLabel: { fontSize: 8, color: G.gray2 },
  totalsValue: { fontSize: 8, fontWeight: 'bold', color: G.dark },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: G.dark,
  },
  grandLabel: { fontSize: 9, fontWeight: 'bold', color: G.white },
  grandValue: { fontSize: 11, fontWeight: 'bold', color: G.white },

  /* ── Note box ── */
  noteBox: {
    marginHorizontal: 50,
    marginTop: 24,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderLeftWidth: 3,
    borderColor: '#f59e0b',
    borderRadius: 2,
  },
  noteTitle: { fontSize: 7, fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  noteText:  { fontSize: 8, color: '#78350f', lineHeight: 1.5 },

  /* ── Footer ── */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerBar: {
    height: 2,
    backgroundColor: G.black,
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 14,
    backgroundColor: G.dark,
  },
  footerBrand: { fontSize: 10, fontWeight: 'bold', color: G.white, letterSpacing: 3 },
  footerMeta:  { fontSize: 7, color: G.gray3, textAlign: 'right', lineHeight: 1.6 },
});

export const InvoiceDocument = ({ order }: { order: any }) => {
  const billing         = order.billing_details || {};
  const shippingFallback = order.payment_response?.order?.shipping_data || {};
  const paymentSource   = order.payment_response?.source_data || {};

  const firstName = billing.first_name || shippingFallback.first_name || "Guest";
  const lastName  = billing.last_name  || shippingFallback.last_name  || "";
  const street    = billing.street     || shippingFallback.street     || "N/A";
  const city      = billing.city       || shippingFallback.city       || "N/A";
  const state     = billing.state      || shippingFallback.state      || "N/A";
  const phone     = billing.phone_number || shippingFallback.phone_number || "N/A";
  const building  = billing.building   || shippingFallback.building   || "";
  const email     = billing.email      || shippingFallback.email      || "";

  const isCash = order.payment_provider === 'cash_on_delivery' || order.payment_provider === 'cash on delivary';
  const isPaid = order.is_paid || order.payment_response?.success || (order.status === 'completed' && isCash);

  const subtotal = order.items?.reduce(
    (acc: number, item: any) => acc + item.price_at_purchase * item.quantity, 0
  ) ?? order.total_amount;

  const issueDate = new Date(order.created_at);
  const issueDateStr = issueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const issueTimeStr = issueDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const statusColor = {
    completed:  G.green,
    processing: G.accent,
    pending:    '#d97706',
    cancelled:  G.red,
  }[order.status as string] ?? G.gray2;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Top accent bar */}
        <View style={styles.topBar} />

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>GOTIY</Text>
            <Text style={styles.brandTagline}>OFFICIAL TAX INVOICE</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.invoiceBadge}>INVOICE</Text>
            <View style={{ height: 8 }} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice No.</Text>
              <Text style={styles.metaValue}>#{order.id?.toString().slice(-10).toUpperCase()}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{issueDateStr}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValue}>{issueTimeStr}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Currency</Text>
              <Text style={styles.metaValue}>{order.currency}</Text>
            </View>
          </View>
        </View>

        {/* ── Status ribbon ── */}
        <View style={[styles.statusRibbon, { borderColor: statusColor, backgroundColor: statusColor + '10' }]}>
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>Order Status</Text>
            <Text style={[styles.ribbonValue, { color: statusColor }]}>{order.status?.toUpperCase()}</Text>
          </View>
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>Payment</Text>
            <Text style={[styles.ribbonValue, { color: isPaid ? G.green : G.red }]}>
              {isPaid ? 'PAID' : isCash ? 'COLLECT ON DELIVERY' : 'PENDING'}
            </Text>
          </View>
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>Items</Text>
            <Text style={styles.ribbonValue}>{order.items?.length ?? 0}</Text>
          </View>
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>Internal ID</Text>
            <Text style={[styles.ribbonValue, { fontFamily: 'Courier', fontSize: 8 }]}>
              {order.id?.toString().slice(-12)}
            </Text>
          </View>
        </View>

        {/* ── Info section ── */}
        <View style={styles.infoSection}>
          {/* Bill To */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Bill To / Ship To</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Name</Text>
              <Text style={styles.infoVal}>{firstName} {lastName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Phone</Text>
              <Text style={styles.infoVal}>{phone}</Text>
            </View>
            {email ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Email</Text>
                <Text style={[styles.infoVal, { fontSize: 7.5 }]}>{email}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Address</Text>
              <Text style={[styles.infoVal, { maxWidth: 140, textAlign: 'right' }]}>
                {street}{building ? `, Bldg ${building}` : ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>City / State</Text>
              <Text style={styles.infoVal}>{city}, {state}</Text>
            </View>
          </View>

          {/* Payment Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Payment Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Provider</Text>
              <Text style={styles.infoVal}>{order.payment_provider?.toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Method</Text>
              <Text style={styles.infoVal}>
                {isCash ? 'Cash on Delivery' : (paymentSource.sub_type || paymentSource.type || 'Online Payment')}
              </Text>
            </View>
            {paymentSource.type && (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Type</Text>
                <Text style={styles.infoVal}>{paymentSource.type}</Text>
              </View>
            )}
            {order.provider_order_id && (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Gateway Order</Text>
                <Text style={[styles.infoValMono]}>{order.provider_order_id?.toString().slice(-14)}</Text>
              </View>
            )}
            {order.payment_response?.id && (
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Transaction ID</Text>
                <Text style={[styles.infoValMono]}>{order.payment_response.id?.toString().slice(-14)}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>User ID</Text>
              <Text style={[styles.infoValMono]}>{order.user_id?.toString().slice(-14)}</Text>
            </View>
          </View>
        </View>

        {/* ── Items Table ── */}
        <View style={styles.tableWrap}>
          <Text style={styles.tableTitle}>Order Items</Text>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadText, styles.colIdx]}>#</Text>
            <Text style={[styles.tableHeadText, styles.colDesc]}>Product</Text>
            <Text style={[styles.tableHeadText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeadText, styles.colUnit]}>Unit Price</Text>
            <Text style={[styles.tableHeadText, styles.colTotal]}>Total</Text>
          </View>

          {order.items?.map((item: any, i: number) => (
            <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.itemNum, styles.colIdx]}>{i + 1}</Text>
              <View style={styles.colDesc}>
                <Text style={styles.itemTitle}>{item.product_title || 'Product'}</Text>
                <Text style={styles.itemSku}>PID: {item.product_id}</Text>
              </View>
              <Text style={[{ fontSize: 9, color: G.dark, textAlign: 'center' }, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[{ fontSize: 9, color: G.gray2, textAlign: 'right' }, styles.colUnit]}>
                {Number(item.price_at_purchase).toLocaleString()} {order.currency}
              </Text>
              <Text style={[{ fontSize: 9, fontWeight: 'bold', color: G.dark, textAlign: 'right' }, styles.colTotal]}>
                {(item.price_at_purchase * item.quantity).toLocaleString()} {order.currency}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Totals ── */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{Number(subtotal).toLocaleString()} {order.currency}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Shipping</Text>
              <Text style={styles.totalsValue}>Included</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax / VAT</Text>
              <Text style={styles.totalsValue}>Included</Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>{isPaid ? 'AMOUNT PAID' : 'TOTAL DUE'}</Text>
              <Text style={styles.grandValue}>{Number(order.total_amount).toLocaleString()} {order.currency}</Text>
            </View>
          </View>
        </View>

        {/* ── Note (cash on delivery) ── */}
        {isCash && !isPaid && (
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Collection Note</Text>
            <Text style={styles.noteText}>
              This order is to be paid in cash upon delivery. Please collect {Number(order.total_amount).toLocaleString()} {order.currency} from the recipient at the time of handover.
            </Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <View style={styles.footerBar} />
          <View style={styles.footerInner}>
            <Text style={styles.footerBrand}>GOTIY</Text>
            <Text style={styles.footerMeta}>
              {'This is a computer-generated invoice. No signature required.\n'}
              {'Order ID: ' + order.id + ' | Generated: ' + new Date().toISOString()}
            </Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
