"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Estilização para o pdf
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF" },
  header: { marginBottom: 20, borderBottom: 2, borderBottomColor: "#1e40af", paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827", textTransform: "uppercase" },
  subtitle: { fontSize: 10, color: "#6b7280", marginTop: 4 },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderTopWidth: 1, borderTopColor: "#e5e7eb", marginTop: 20 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f3f4f6", alignItems: "center", minHeight: 30 },
  tableColHeader: { width: "16.6%", fontSize: 10, fontWeight: "bold", color: "#374151", padding: 5, backgroundColor: "#f9fafb" },
  tableCol: { width: "16.6%", fontSize: 9, color: "#4b5563", padding: 5 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 10, flexDirection: "row", justifyBetween: true },
  footerText: { fontSize: 8, color: "#9ca3af" }
});

export function PdfAbastecimento({ registros }: { registros: any[] }) {
  const gastoTotal = registros.reduce((acc, curr) => acc + curr.valorTotal, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Abastecimentos</Text>
          <Text style={styles.subtitle}>Extraído em: {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
            <Text style={styles.tableColHeader}>Data</Text>
            <Text style={styles.tableColHeader}>Veículo</Text>
            <Text style={styles.tableColHeader}>Motorista</Text>
            <Text style={styles.tableColHeader}>Posto</Text>
            <Text style={styles.tableColHeader}>Litros</Text>
            <Text style={styles.tableColHeader}>Total (R$)</Text>
          </View>

          {registros.map((reg, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCol}>{new Date(reg.data).toLocaleDateString('pt-BR')}</Text>
              <Text style={styles.tableCol}>{reg.veiculo.placa}</Text>
              <Text style={styles.tableCol}>{reg.motorista.nome.split(' ')[0]}</Text>
              <Text style={styles.tableCol}>{reg.posto.nome}</Text>
              <Text style={styles.tableCol}>{reg.quantidadeLitros.toFixed(1)}L</Text>
              <Text style={styles.tableCol}>R$ {reg.valorTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Resumo Final */}
        <View style={{ marginTop: 30, padding: 10, backgroundColor: "#eff6ff", borderRadius: 5 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#1e40af" }}>
            Investimento Total no Período: R$ {gastoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Sistema de Gestão de Frota - v2.0</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}