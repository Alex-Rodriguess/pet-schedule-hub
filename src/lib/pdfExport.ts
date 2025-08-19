// utils/pdfExport.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportReportsToPDF(reports, filterMonth) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatórios - Pet Schedule Hub', 14, 18);
  doc.setFontSize(12);
  doc.text(`Mês: ${filterMonth}`, 14, 28);

  const tableColumn = ['Relatório', 'Valor'];
  const tableRows = reports.map(r => [r.title, r.value]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
  });

  doc.save(`relatorios_${filterMonth}.pdf`);
}
