import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { DevisPDFData } from '@/app/api/pdf/devis/route';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    color: '#1a1a2e',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  companyName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a2e',
  },
  companyTagline: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  devisTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#3b82f6',
    textAlign: 'right',
  },
  devisNumber: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6 8',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  colRef: { width: '15%' },
  colDesig: { width: '40%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPU: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  headerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#6b7280',
    width: 100,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 10,
    width: 80,
    textAlign: 'right',
  },
  totalTTCRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    backgroundColor: '#1a1a2e',
    padding: '8 12',
    borderRadius: 4,
    marginTop: 4,
  },
  totalTTCLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    width: 100,
    textAlign: 'right',
  },
  totalTTCValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    width: 80,
    textAlign: 'right',
  },
  notes: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af',
  },
});

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export function DevisPDF({ data }: { data: DevisPDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>FastGross Pro</Text>
            <Text style={styles.companyTagline}>Plateforme B2B Grossistes Halal</Text>
          </View>
          <View>
            <Text style={styles.devisTitle}>DEVIS</Text>
            <Text style={styles.devisNumber}>{data.numero}</Text>
          </View>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.clientName}>{data.clientNom}</Text>
          {data.clientAdresse ? <Text style={{ fontSize: 9, color: '#6b7280' }}>{data.clientAdresse}</Text> : null}
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date d&apos;émission</Text>
            <Text style={styles.metaValue}>{data.dateCreation}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Valable jusqu&apos;au</Text>
            <Text style={[styles.metaValue, { color: '#ef4444' }]}>{data.dateExpiration}</Text>
          </View>
          {data.commercialNom ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Commercial</Text>
              <Text style={styles.metaValue}>{data.commercialNom}</Text>
            </View>
          ) : null}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colRef]}>Réf.</Text>
            <Text style={[styles.headerText, styles.colDesig]}>Désignation</Text>
            <Text style={[styles.headerText, styles.colQty]}>Qté</Text>
            <Text style={[styles.headerText, styles.colPU]}>PU HT</Text>
            <Text style={[styles.headerText, styles.colTotal]}>Total HT</Text>
          </View>
          {data.lignes.map((ligne, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 ? {} : { backgroundColor: '#fafafa' }]}>
              <Text style={[{ fontSize: 9, color: '#6b7280' }, styles.colRef]}>{ligne.ref}</Text>
              <Text style={[{ fontSize: 9 }, styles.colDesig]}>{ligne.designation}</Text>
              <Text style={[{ fontSize: 9, textAlign: 'center' }, styles.colQty]}>{ligne.quantite}</Text>
              <Text style={[{ fontSize: 9, textAlign: 'right' }, styles.colPU]}>{fmt(ligne.prixUnitaireHT)}</Text>
              <Text style={[{ fontSize: 9, textAlign: 'right' }, styles.colTotal]}>{fmt(ligne.totalHT)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{fmt(data.totalHT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({data.tva}%)</Text>
            <Text style={styles.totalValue}>{fmt(data.totalHT * data.tva / 100)}</Text>
          </View>
          <View style={styles.totalTTCRow}>
            <Text style={styles.totalTTCLabel}>Total TTC</Text>
            <Text style={styles.totalTTCValue}>{fmt(data.totalTTC)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes ? (
          <View style={styles.notes}>
            <Text style={[styles.sectionTitle, { marginBottom: 4 }]}>Notes</Text>
            <Text style={{ fontSize: 9, color: '#4b5563' }}>{data.notes}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>FastGross Pro © {new Date().getFullYear()}</Text>
          <Text>Devis non contractuel — Valable 30 jours</Text>
          <Text>{data.numero}</Text>
        </View>
      </Page>
    </Document>
  );
}
