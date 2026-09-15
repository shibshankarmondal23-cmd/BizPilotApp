import { jsPDF } from 'jspdf';
import { InvoiceData, QuoteData, ProposalData } from '../types';

export function getCurrencySymbol(code: string): string {
  switch (code) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'CAD':
      return 'CA$';
    case 'AUD':
      return 'AU$';
    case 'USD':
    default:
      return '$';
  }
}

export function formatMoney(amount: number, currencyCode: string): string {
  const sym = getCurrencySymbol(currencyCode);
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${sym}${formatted}` : `${sym}${formatted}`;
}

// ---------------------------------------------------------------------------
// 1. INVOICE PDF GENERATOR
// ---------------------------------------------------------------------------
export function generateInvoicePDF(data: InvoiceData): void {
  // US Letter: 612 x 792 pt
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 532 pt
  let currentY = margin;

  // Header Banner
  const maxBizNameWidth = contentWidth - 170;
  doc.setFont('helvetica', 'bold');
  const bizName = data.businessName || 'Business Name';
  const nameWidth = doc.getTextWidth(bizName);
  const bizFontSize = nameWidth > maxBizNameWidth ? 15 : 19;
  doc.setFontSize(bizFontSize);
  const bizLines = doc.splitTextToSize(bizName, maxBizNameWidth);

  const headerHeight = Math.max(78, 30 + bizLines.length * (bizFontSize + 2) + 20);

  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, currentY, contentWidth, headerHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.rect(margin, currentY, contentWidth, headerHeight, 'S');

  // Business Name on left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(bizFontSize);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(bizLines, margin + 16, currentY + 28);

  const contactStartY = currentY + 28 + (bizLines.length - 1) * (bizFontSize + 2) + 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  const bizContact = [data.businessEmail, data.businessPhone].filter(Boolean).join(' • ');
  if (bizContact) {
    const contactLines = doc.splitTextToSize(bizContact, maxBizNameWidth);
    doc.text(contactLines[0], margin + 16, contactStartY);
  }
  if (data.businessAddress) {
    const addressLines = doc.splitTextToSize(data.businessAddress, maxBizNameWidth);
    doc.text(addressLines[0], margin + 16, contactStartY + 12);
  }

  // "INVOICE" on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('INVOICE', pageWidth - margin - 16, currentY + 32, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`# ${data.invoiceNumber || 'INV-001'}`, pageWidth - margin - 16, currentY + 50, { align: 'right' });

  currentY += headerHeight + 18;

  // Metadata: Dates and Currency
  doc.setFillColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);

  // Left Column: Bill To
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('BILLED TO', margin, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(data.clientName || 'Client / Company Name', margin, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  let clientOffset = currentY + 30;
  if (data.clientEmail) {
    doc.text(data.clientEmail, margin, clientOffset);
    clientOffset += 13;
  }
  if (data.clientAddress) {
    const addressLines = doc.splitTextToSize(data.clientAddress, 240);
    doc.text(addressLines, margin, clientOffset);
    clientOffset += addressLines.length * 12;
  }

  // Right Column: Invoice Details
  const rightColX = pageWidth - margin - 170;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('INVOICE DETAILS', rightColX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Issue Date:', rightColX, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.invoiceDate || new Date().toISOString().split('T')[0], pageWidth - margin, currentY + 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Payment Due:', rightColX, currentY + 30);
  doc.setFont('helvetica', 'bold');
  doc.text(data.dueDate || 'Upon Receipt', pageWidth - margin, currentY + 30, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Currency:', rightColX, currentY + 44);
  doc.setFont('helvetica', 'bold');
  doc.text(data.currency || 'USD', pageWidth - margin, currentY + 44, { align: 'right' });

  currentY = Math.max(clientOffset + 15, currentY + 65);

  // Table Helper
  const drawTableHeader = (y: number) => {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 24, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.75);
    doc.line(margin, y + 24, margin + contentWidth, y + 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    doc.text('DESCRIPTION / ITEM', margin + 10, y + 15);
    doc.text('QTY', margin + 300, y + 15, { align: 'right' });
    doc.text('UNIT PRICE', margin + 410, y + 15, { align: 'right' });
    doc.text('LINE TOTAL', margin + contentWidth - 10, y + 15, { align: 'right' });
  };

  drawTableHeader(currentY);
  currentY += 24;

  // Line items
  const items = data.items.length > 0 ? data.items : [{ id: '1', description: 'Professional Services', quantity: 1, unitPrice: 0 }];
  let subtotal = 0;

  items.forEach((item, index) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const lineTotal = qty * price;
    subtotal += lineTotal;

    const descLines = doc.splitTextToSize(item.description || 'Service description', 260);
    const rowHeight = Math.max(22, descLines.length * 13 + 8);

    // Multi-page check
    if (currentY + rowHeight > pageHeight - 120) {
      doc.addPage();
      currentY = margin;
      drawTableHeader(currentY);
      currentY += 24;
    }

    // Zebra stripes
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    // Border bottom
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(descLines, margin + 10, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(qty.toString(), margin + 300, currentY + 14, { align: 'right' });
    doc.text(formatMoney(price, data.currency), margin + 410, currentY + 14, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(formatMoney(lineTotal, data.currency), margin + contentWidth - 10, currentY + 14, { align: 'right' });

    currentY += rowHeight;
  });

  // Calculate totals
  const discountRate = Number(data.discountPercent) || 0;
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(data.taxPercent) || 0;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // Space check for Totals block
  if (currentY + 140 > pageHeight - 60) {
    doc.addPage();
    currentY = margin;
  }

  currentY += 14;

  // Notes on the Left, Totals on the Right
  const totalsX = pageWidth - margin - 220;
  const totalsWidth = 220;

  // Notes / Terms
  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('PAYMENT TERMS & NOTES', margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const notesLines = doc.splitTextToSize(data.notes, 260);
    doc.text(notesLines, margin, currentY + 14);
  }

  // Totals Box
  let totalsY = currentY;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', totalsX, totalsY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatMoney(subtotal, data.currency), pageWidth - margin, totalsY, { align: 'right' });
  totalsY += 16;

  // Discount
  if (discountRate > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Discount (${discountRate}%):`, totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38); // red
    doc.text(`-${formatMoney(discountAmount, data.currency)}`, pageWidth - margin, totalsY, { align: 'right' });
    totalsY += 16;
  }

  // Tax
  if (taxRate > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Tax (${taxRate}%):`, totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatMoney(taxAmount, data.currency), pageWidth - margin, totalsY, { align: 'right' });
    totalsY += 16;
  }

  // Grand Total Card
  totalsY += 4;
  doc.setFillColor(15, 23, 42); // dark slate
  doc.roundedRect(totalsX - 10, totalsY, totalsWidth + 10, 34, 4, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('GRAND TOTAL', totalsX, totalsY + 21);

  doc.setFontSize(14);
  doc.text(formatMoney(grandTotal, data.currency), pageWidth - margin, totalsY + 22, { align: 'right' });

  // Footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated securely in-browser with BizPilot • www.bizpilot.io', margin, pageHeight - 20);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  const cleanFilename = `Invoice-${data.invoiceNumber || 'INV-001'}.pdf`.replace(/[^a-zA-Z0-9._-]/g, '_');
  doc.save(cleanFilename);
}

// ---------------------------------------------------------------------------
// 2. QUOTE GENERATOR PDF
// ---------------------------------------------------------------------------
export function generateQuotePDF(data: QuoteData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Header Banner
  const maxBizNameWidth = contentWidth - 170;
  doc.setFont('helvetica', 'bold');
  const bizName = data.businessName || 'Business Name';
  const nameWidth = doc.getTextWidth(bizName);
  const bizFontSize = nameWidth > maxBizNameWidth ? 15 : 19;
  doc.setFontSize(bizFontSize);
  const bizLines = doc.splitTextToSize(bizName, maxBizNameWidth);

  const headerHeight = Math.max(78, 30 + bizLines.length * (bizFontSize + 2) + 20);

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, currentY, contentWidth, headerHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.rect(margin, currentY, contentWidth, headerHeight, 'S');

  // Business Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(bizFontSize);
  doc.setTextColor(15, 23, 42);
  doc.text(bizLines, margin + 16, currentY + 28);

  const contactStartY = currentY + 28 + (bizLines.length - 1) * (bizFontSize + 2) + 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const bizContact = [data.businessEmail, data.businessPhone].filter(Boolean).join(' • ');
  if (bizContact) {
    const contactLines = doc.splitTextToSize(bizContact, maxBizNameWidth);
    doc.text(contactLines[0], margin + 16, contactStartY);
  }
  if (data.businessAddress) {
    const addressLines = doc.splitTextToSize(data.businessAddress, maxBizNameWidth);
    doc.text(addressLines[0], margin + 16, contactStartY + 12);
  }

  // "PRICE QUOTE" on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(13, 148, 136); // teal-600 / green-600 for quotes
  doc.text('PRICE QUOTE', pageWidth - margin - 16, currentY + 32, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`# ${data.quoteNumber || 'QT-001'}`, pageWidth - margin - 16, currentY + 50, { align: 'right' });

  currentY += headerHeight + 18;

  // Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('PREPARED FOR', margin, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(data.clientName || 'Client / Company Name', margin, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  let clientOffset = currentY + 30;
  if (data.clientEmail) {
    doc.text(data.clientEmail, margin, clientOffset);
    clientOffset += 13;
  }
  if (data.clientAddress) {
    const addressLines = doc.splitTextToSize(data.clientAddress, 240);
    doc.text(addressLines, margin, clientOffset);
    clientOffset += addressLines.length * 12;
  }

  // Right Column: Quote Details
  const rightColX = pageWidth - margin - 170;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('ESTIMATE DETAILS', rightColX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Quote Date:', rightColX, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.quoteDate || new Date().toISOString().split('T')[0], pageWidth - margin, currentY + 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Valid Until:', rightColX, currentY + 30);
  doc.setFont('helvetica', 'bold');
  doc.text(data.validUntil || '30 Days', pageWidth - margin, currentY + 30, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Currency:', rightColX, currentY + 44);
  doc.setFont('helvetica', 'bold');
  doc.text(data.currency || 'USD', pageWidth - margin, currentY + 44, { align: 'right' });

  currentY = Math.max(clientOffset + 15, currentY + 65);

  // Table
  const drawTableHeader = (y: number) => {
    doc.setFillColor(240, 253, 250); // teal-50
    doc.rect(margin, y, contentWidth, 24, 'F');
    doc.setDrawColor(204, 251, 241);
    doc.setLineWidth(0.75);
    doc.line(margin, y + 24, margin + contentWidth, y + 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(19, 78, 74);

    doc.text('SERVICE / DELIVERABLE', margin + 10, y + 15);
    doc.text('QTY / HRS', margin + 300, y + 15, { align: 'right' });
    doc.text('RATE', margin + 410, y + 15, { align: 'right' });
    doc.text('AMOUNT', margin + contentWidth - 10, y + 15, { align: 'right' });
  };

  drawTableHeader(currentY);
  currentY += 24;

  const items = data.items.length > 0 ? data.items : [{ id: '1', description: 'Consulting & Implementation Scope', quantity: 1, unitPrice: 0 }];
  let subtotal = 0;

  items.forEach((item, index) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const lineTotal = qty * price;
    subtotal += lineTotal;

    const descLines = doc.splitTextToSize(item.description || 'Service description', 260);
    const rowHeight = Math.max(22, descLines.length * 13 + 8);

    if (currentY + rowHeight > pageHeight - 120) {
      doc.addPage();
      currentY = margin;
      drawTableHeader(currentY);
      currentY += 24;
    }

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(descLines, margin + 10, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(qty.toString(), margin + 300, currentY + 14, { align: 'right' });
    doc.text(formatMoney(price, data.currency), margin + 410, currentY + 14, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(formatMoney(lineTotal, data.currency), margin + contentWidth - 10, currentY + 14, { align: 'right' });

    currentY += rowHeight;
  });

  const discountRate = Number(data.discountPercent) || 0;
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(data.taxPercent) || 0;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  if (currentY + 140 > pageHeight - 60) {
    doc.addPage();
    currentY = margin;
  }

  currentY += 14;

  const totalsX = pageWidth - margin - 220;
  const totalsWidth = 220;

  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('TERMS OF ACCEPTANCE & NOTES', margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const notesLines = doc.splitTextToSize(data.notes, 260);
    doc.text(notesLines, margin, currentY + 14);
  }

  let totalsY = currentY;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', totalsX, totalsY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatMoney(subtotal, data.currency), pageWidth - margin, totalsY, { align: 'right' });
  totalsY += 16;

  if (discountRate > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Discount (${discountRate}%):`, totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`-${formatMoney(discountAmount, data.currency)}`, pageWidth - margin, totalsY, { align: 'right' });
    totalsY += 16;
  }

  if (taxRate > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Tax (${taxRate}%):`, totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatMoney(taxAmount, data.currency), pageWidth - margin, totalsY, { align: 'right' });
    totalsY += 16;
  }

  totalsY += 4;
  doc.setFillColor(19, 78, 74); // dark teal
  doc.roundedRect(totalsX - 10, totalsY, totalsWidth + 10, 34, 4, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('ESTIMATED TOTAL', totalsX, totalsY + 21);

  doc.setFontSize(14);
  doc.text(formatMoney(total, data.currency), pageWidth - margin, totalsY + 22, { align: 'right' });

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated securely in-browser with BizPilot • www.bizpilot.io', margin, pageHeight - 20);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  const cleanFilename = `Quote-${data.quoteNumber || 'QT-001'}.pdf`.replace(/[^a-zA-Z0-9._-]/g, '_');
  doc.save(cleanFilename);
}

// ---------------------------------------------------------------------------
// 3. PROPOSAL GENERATOR PDF
// ---------------------------------------------------------------------------
export function generateProposalPDF(data: ProposalData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Header Cover Banner - dynamic height to support multi-line titles without clipping
  doc.setFont('helvetica', 'bold');
  const titleFontSize = 16;
  doc.setFontSize(titleFontSize);
  const titleLines = doc.splitTextToSize(data.proposalTitle || 'Client Project Proposal', contentWidth - 40);
  const displayedTitleLines = titleLines.slice(0, 3);
  const titleHeight = displayedTitleLines.length * (titleFontSize + 4);
  const bannerHeight = Math.max(90, 48 + titleHeight + 22);

  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, currentY, contentWidth, bannerHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text('PROJECT PROPOSAL', margin + 20, currentY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(titleFontSize);
  doc.setTextColor(255, 255, 255);
  doc.text(displayedTitleLines, margin + 20, currentY + 46);

  const metaY = currentY + 46 + titleHeight + 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Prepared for: ${data.clientName || 'Valued Client'} ${data.companyName ? `(${data.companyName})` : ''}`, margin + 20, metaY);
  doc.text(`Date: ${data.proposalDate || new Date().toISOString().split('T')[0]}`, pageWidth - margin - 20, metaY, { align: 'right' });

  currentY += bannerHeight + 14;

  // Two-column Stakeholders Card
  const colWidth = (contentWidth - 28) / 2;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, contentWidth, 58, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, currentY, contentWidth, 58, 4, 4, 'S');

  // Prepared By
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('PREPARED BY', margin + 14, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const bizNameLines = doc.splitTextToSize(data.businessName || 'Your Business Name', colWidth);
  doc.text(bizNameLines[0], margin + 14, currentY + 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const fromContact = [data.contactName, data.businessEmail, data.businessPhone].filter(Boolean).join(' • ');
  const fromContactLines = doc.splitTextToSize(fromContact || 'Contact information', colWidth);
  doc.text(fromContactLines[0], margin + 14, currentY + 44);

  // Client Details on right
  const clientColX = pageWidth / 2 + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('PREPARED FOR', clientColX, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const clientNameLines = doc.splitTextToSize(data.clientName || 'Client Name', colWidth);
  doc.text(clientNameLines[0], clientColX, currentY + 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const clientContact = [data.companyName, data.clientEmail].filter(Boolean).join(' • ');
  const clientContactLines = doc.splitTextToSize(clientContact || 'Client details', colWidth);
  doc.text(clientContactLines[0], clientColX, currentY + 44);

  currentY += 72;

  // Helper to add structured sections with line-by-line page-break checks to prevent clipping
  const addSection = (title: string, bodyText: string, isKeyBox = false) => {
    if (!bodyText || !bodyText.trim()) return;

    // Ensure header fits on page
    if (currentY + 50 > pageHeight - 65) {
      doc.addPage();
      currentY = margin;
    }

    if (isKeyBox) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const splitLines = doc.splitTextToSize(bodyText, contentWidth - 28);
      const boxHeight = splitLines.length * 13 + 36;

      if (currentY + boxHeight > pageHeight - 65) {
        doc.addPage();
        currentY = margin;
      }

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 4, 4, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.75);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 4, 4, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(title, margin + 14, currentY + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(splitLines, margin + 14, currentY + 34);

      currentY += boxHeight + 14;
    } else {
      // Clean section heading with underline
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(title, margin, currentY + 12);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.75);
      doc.line(margin, currentY + 18, margin + contentWidth, currentY + 18);

      currentY += 32;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);

      const splitLines = doc.splitTextToSize(bodyText, contentWidth);
      for (let i = 0; i < splitLines.length; i++) {
        if (currentY + 13 > pageHeight - 65) {
          doc.addPage();
          currentY = margin;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
        }
        doc.text(splitLines[i], margin, currentY);
        currentY += 13;
      }

      currentY += 14;
    }
  };

  addSection('1. Project Overview & Objective', data.projectDescription);
  addSection('2. Scope of Work', data.scopeOfWork);
  addSection('3. Deliverables', data.deliverables);
  addSection('4. Project Timeline & Milestones', data.timeline);
  addSection('5. Investment & Pricing', data.pricing, true);
  addSection('6. Payment Terms', data.paymentTerms);
  if (data.additionalNotes) {
    addSection('7. Additional Terms & Conditions', data.additionalNotes);
  }

  // Acceptance / Sign-off block
  if (currentY + 80 > pageHeight - 65) {
    doc.addPage();
    currentY = margin;
  }

  currentY += 10;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.75);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('CLIENT ACCEPTANCE & SIGN-OFF:', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Sign below to acknowledge and authorize the proposed scope of work and payment terms.', margin, currentY + 14);

  currentY += 35;
  const sigColWidth = (contentWidth - 40) / 2;

  // Signature line 1
  doc.line(margin, currentY, margin + sigColWidth, currentY);
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Authorized Signature', margin, currentY + 12);
  doc.text('Date', margin + sigColWidth - 30, currentY + 12);

  // Signature line 2
  const sigCol2X = margin + sigColWidth + 40;
  doc.line(sigCol2X, currentY, sigCol2X + sigColWidth, currentY);
  doc.text('Printed Name & Title', sigCol2X, currentY + 12);

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated securely in-browser with BizPilot • www.bizpilot.io', margin, pageHeight - 20);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  const cleanFilename = `Proposal-${(data.proposalTitle || 'Project').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(cleanFilename);
}
