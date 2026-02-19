package com.riskmonitor.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.borders.SolidBorder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    // Color constants matching the frontend theme
    private static final Color CRITICAL_COLOR = new DeviceRgb(239, 68, 68);
    private static final Color HIGH_COLOR = new DeviceRgb(251, 146, 60);
    private static final Color MEDIUM_COLOR = new DeviceRgb(245, 197, 24);
    private static final Color LOW_COLOR = new DeviceRgb(0, 212, 170);
    private static final Color ACCENT_COLOR = new DeviceRgb(0, 174, 239);
    private static final Color DARK_BG = new DeviceRgb(8, 11, 17);
    private static final Color GRAY_TEXT = new DeviceRgb(148, 163, 184);

    /**
     * Generate individual customer report with charts
     */
    public byte[] generateCustomerReport(String customerId, JsonNode customerData, Map<String, String> charts)
            throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Extract data
        JsonNode profile = customerData.get("profile");
        JsonNode financialSummary = customerData.get("financialSummary");
        JsonNode riskAssessment = customerData.get("riskAssessment");
        JsonNode recentTransactions = customerData.get("recentTransactions");
        JsonNode alerts = customerData.get("alerts");

        String customerName = profile.get("name").asText();
        String status = profile.get("status").asText();
        int creditScore = profile.get("creditScore").asInt();
        int riskPercentage = riskAssessment.get("riskPercentage").asInt();

        // ═══════════════════════════════════════════════════════════
        // PAGE 1 — COVER PAGE
        // ═══════════════════════════════════════════════════════════

        // Risk status banner
        Color statusColor = getStatusColor(status);
        Paragraph statusBanner = new Paragraph(status.toUpperCase() + " RISK ASSESSMENT")
                .setBackgroundColor(statusColor)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(statusBanner);

        // Title
        Paragraph title = new Paragraph("REPORT")
                .setFontSize(32)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);

        // Customer info
        document.add(new Paragraph("Customer: " + customerName).setFontSize(16).setBold().setMarginTop(20));
        document.add(new Paragraph("Customer ID: " + customerId).setFontSize(12).setFontColor(GRAY_TEXT));
        document.add(new Paragraph(
                "Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")))
                .setFontSize(12).setFontColor(GRAY_TEXT));

        // Risk summary box
        document.add(new Paragraph("\nRISK LEVEL: " + status.toUpperCase())
                .setFontSize(18)
                .setBold()
                .setFontColor(statusColor)
                .setMarginTop(30));

        document.add(new Paragraph("Risk Score: " + riskPercentage + "% | Default Probability: "
                + (riskPercentage > 70 ? "HIGH" : "MEDIUM"))
                .setFontSize(12));

        document.add(new Paragraph("Immediate Intervention Required Within 48 Hours")
                .setFontSize(11)
                .setFontColor(CRITICAL_COLOR)
                .setMarginTop(5));

        document.add(new Paragraph("Classification: High-Priority Delinquency Risk")
                .setFontSize(11)
                .setMarginTop(2));

        document.add(new Paragraph("Recommended Action: Immediate Contact + Payment Restructuring")
                .setFontSize(11)
                .setMarginTop(2));

        // ═══════════════════════════════════════════════════════════
        // PAGE 2 — EXECUTIVE SUMMARY
        // ═══════════════════════════════════════════════════════════
        document.add(new AreaBreak());

        document.add(new Paragraph("EXECUTIVE SUMMARY")
                .setFontSize(18)
                .setBold()
                .setBackgroundColor(ACCENT_COLOR)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setPadding(5));

        String summary = String.format(
                "%s (ID: %s) presents a %s delinquency risk with a %d%% probability of default within the next 30 days. "
                        +
                        "Our AI-powered behavioral analysis has identified multiple converging risk factors that require immediate intervention.",
                customerName, customerId, status.toLowerCase(), riskPercentage);
        document.add(new Paragraph(summary).setMarginTop(10).setMarginBottom(15));

        // Key findings
        document.add(new Paragraph("Key Findings:").setBold().setFontSize(12));

        List<String> findings = List.of(
                "Credit Score: " + creditScore + " (" + profile.get("creditScoreStatus").asText() + ")",
                "Monthly Income: ₹" + formatCurrency(financialSummary.get("monthlyIncome").asInt()),
                "Monthly Expenses: ₹" + formatCurrency(financialSummary.get("monthlyExpenses").asInt()),
                "Net Worth: ₹" + formatCurrency(financialSummary.get("netWorth").asInt()),
                "Total Debt: ₹" + formatCurrency(financialSummary.get("totalDebt").asInt()),
                "Risk Level: " + status + " (" + riskPercentage + "%)");

        for (String finding : findings) {
            document.add(new Paragraph("• " + finding).setMarginLeft(15).setFontSize(11));
        }

        // ═══════════════════════════════════════════════════════════
        // PAGE 3 — FINANCIAL SUMMARY
        // ═══════════════════════════════════════════════════════════
        document.add(new AreaBreak());

        document.add(new Paragraph("FINANCIAL SUMMARY")
                .setFontSize(18)
                .setBold()
                .setBackgroundColor(ACCENT_COLOR)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setPadding(5));

        // Financial table
        Table financialTable = new Table(new float[] { 3, 2, 1 });
        financialTable.setWidth(UnitValue.createPercentValue(100));
        financialTable.setMarginTop(15);

        // Header
        addTableHeader(financialTable, "Metric", "Amount (₹)", "Status");

        // Rows
        addFinancialRow(financialTable, "Monthly Income", financialSummary.get("monthlyIncome").asInt(), "Normal");
        addFinancialRow(financialTable, "Monthly Expenses", financialSummary.get("monthlyExpenses").asInt(),
                financialSummary.get("monthlyExpenses").asInt() > financialSummary.get("monthlyIncome").asInt() ? "High"
                        : "Normal");
        addFinancialRow(financialTable, "Total Assets", financialSummary.get("totalAssets").asInt(), "Normal");
        addFinancialRow(financialTable, "Total Liabilities", financialSummary.get("totalLiabilities").asInt(), "High");
        addFinancialRow(financialTable, "Net Worth", financialSummary.get("netWorth").asInt(),
                financialSummary.get("netWorth").asInt() < 0 ? "Critical" : "Normal");
        addFinancialRow(financialTable, "Total Debt", financialSummary.get("totalDebt").asInt(), "High");

        document.add(financialTable);

        // ═══════════════════════════════════════════════════════════
        // PAGE 4 — VISUAL ANALYTICS (Charts)
        // ═══════════════════════════════════════════════════════════
        document.add(new AreaBreak());

        document.add(new Paragraph("VISUAL ANALYTICS")
                .setFontSize(18)
                .setBold()
                .setBackgroundColor(ACCENT_COLOR)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setPadding(5));

        // Add charts if provided
        if (charts != null && !charts.isEmpty()) {

            // Cash Flow Chart
            if (charts.containsKey("cashFlow")) {
                document.add(new Paragraph("1. Cash Flow Stability").setBold().setFontSize(14).setMarginTop(15));
                document.add(new Paragraph("Analysis of income vs expenses over the last 6 months.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(10));
                addChartImage(document, charts.get("cashFlow"));
            }

            // Credit Score Chart
            if (charts.containsKey("creditScore")) {
                document.add(new AreaBreak());
                document.add(new Paragraph("2. Credit Score Trend").setBold().setFontSize(14).setMarginTop(15));
                document.add(new Paragraph("Credit score progression showing declining trend.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(10));
                addChartImage(document, charts.get("creditScore"));
            }

            // Payment History Chart
            if (charts.containsKey("paymentHistory")) {
                document.add(new AreaBreak());
                document.add(new Paragraph("3. Payment History").setBold().setFontSize(14).setMarginTop(15));
                document.add(new Paragraph("On-time vs late payment distribution over time.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(10));
                addChartImage(document, charts.get("paymentHistory"));
            }

            // Liquidity Chart
            if (charts.containsKey("liquidity")) {
                document.add(new AreaBreak());
                document.add(new Paragraph("4. Liquidity Analysis").setBold().setFontSize(14).setMarginTop(15));
                document.add(new Paragraph("Liquid assets availability and depletion rate.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(10));
                addChartImage(document, charts.get("liquidity"));
            }
        }

        // ═══════════════════════════════════════════════════════════
        // PAGE 5 — RECENT TRANSACTIONS
        // ═══════════════════════════════════════════════════════════
        document.add(new AreaBreak());

        document.add(new Paragraph("TRANSACTION PATTERN ANALYSIS")
                .setFontSize(18)
                .setBold()
                .setBackgroundColor(ACCENT_COLOR)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setPadding(5));

        document.add(
                new Paragraph("Analysis of the last 30 days of transaction data reveals several high-risk patterns:")
                        .setMarginTop(10)
                        .setMarginBottom(15));

        // Transaction table
        Table txTable = new Table(new float[] { 2, 4, 2, 2 });
        txTable.setWidth(UnitValue.createPercentValue(100));

        addTableHeader(txTable, "Date", "Transaction", "Amount", "Risk Flag");

        for (JsonNode tx : recentTransactions) {
            String date = tx.get("date").asText();
            String description = tx.get("description").asText();
            int amount = tx.get("amount").asInt();
            String type = tx.get("type").asText();

            String riskFlag = getRiskFlag(description);

            txTable.addCell(new Cell().add(new Paragraph(date).setFontSize(9)));
            txTable.addCell(new Cell().add(new Paragraph(description).setFontSize(9)));
            txTable.addCell(new Cell().add(new Paragraph("₹" + formatCurrency(Math.abs(amount))).setFontSize(9)));
            txTable.addCell(
                    new Cell().add(new Paragraph(riskFlag).setFontSize(9).setFontColor(getRiskFlagColor(riskFlag))));
        }

        document.add(txTable);

        // ═══════════════════════════════════════════════════════════
        // PAGE 6 — ALERTS & RECOMMENDATIONS
        // ═══════════════════════════════════════════════════════════
        document.add(new AreaBreak());

        document.add(new Paragraph("RECENT ALERTS")
                .setFontSize(18)
                .setBold()
                .setBackgroundColor(ACCENT_COLOR)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setPadding(5));

        if (alerts != null && alerts.size() > 0) {
            for (JsonNode alert : alerts) {
                String alertType = alert.get("type").asText();
                String message = alert.get("message").asText();
                String date = alert.get("date").asText();

                Color alertColor = getAlertColor(alertType);

                Paragraph alertPara = new Paragraph("⚠ " + message + " (" + date + ")")
                        .setFontSize(11)
                        .setFontColor(alertColor)
                        .setMarginTop(8)
                        .setMarginLeft(10)
                        .setPaddingLeft(10)
                        .setBorderLeft(new SolidBorder(alertColor, 3));

                document.add(alertPara);
            }
        } else {
            document.add(new Paragraph("No recent alerts.").setMarginTop(10));
        }

        // Recommendations
        document.add(new Paragraph("\nRECOMMENDED INTERVENTION STRATEGY")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        List<String> recommendations = List.of(
                "IMMEDIATE CONTACT (Within 24 Hours): Phone call from relationship manager, express concern and willingness to help",
                "PAYMENT RESTRUCTURING (Days 2-7): Offer EMI moratorium for 2 months, reduce monthly EMI by 35%, waive all late fees",
                "FINANCIAL COUNSELING (Ongoing): Enroll in mandatory financial literacy program, create realistic monthly budget",
                "MONITORING & SUPPORT (Days 8-60): Real-time transaction monitoring, weekly check-in calls for first month");

        int recNum = 1;
        for (String rec : recommendations) {
            document.add(new Paragraph(recNum + ". " + rec)
                    .setFontSize(10)
                    .setMarginTop(8)
                    .setMarginLeft(15));
            recNum++;
        }

        // Footer
        document.add(new Paragraph("\n\n_____________________________________________________________________")
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30));

        document.add(new Paragraph("Report Generated By: RiskAvert AI Platform v2.1")
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(GRAY_TEXT));

        document.add(new Paragraph("Analysis Date: "
                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")))
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(GRAY_TEXT));

        document.add(new Paragraph("Report Status: CONFIDENTIAL – For Authorized Personnel Only")
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(GRAY_TEXT)
                .setMarginBottom(10));

        document.close();
        return baos.toByteArray();
    }

    /**
     * Generate bulk report for multiple customers
     */
    public byte[] generateBulkReport(List<String> customerIds, String reportType, String generatedBy) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Cover page
        document.add(new Paragraph(reportType.toUpperCase())
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(50));

        document.add(new Paragraph("Generated by: " + generatedBy)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10));

        document.add(new Paragraph("Date: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")))
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("Total Customers: " + customerIds.size())
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10));

        // Customer list
        document.add(new AreaBreak());
        document.add(new Paragraph("CUSTOMER LIST")
                .setFontSize(18)
                .setBold()
                .setBackgroundColor(ACCENT_COLOR)
                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                .setPadding(5));

        document.add(new Paragraph("This report contains " + customerIds.size()
                + " customers identified as high-risk based on AI analysis.")
                .setMarginTop(10)
                .setMarginBottom(15));

        // Simple list
        int num = 1;
        for (String customerId : customerIds) {
            document.add(new Paragraph(num + ". Customer ID: " + customerId)
                    .setFontSize(11)
                    .setMarginLeft(20)
                    .setMarginTop(5));
            num++;
        }

        document.add(new Paragraph("\n\nFor detailed individual reports, please use the customer profile page.")
                .setMarginTop(30)
                .setFontSize(10)
                .setFontColor(GRAY_TEXT)
                .setItalic());

        document.close();
        return baos.toByteArray();
    }

    /**
     * Get stored report (placeholder for demo)
     */
    public byte[] getStoredReport(String reportId) throws Exception {
        // For hackathon, return a simple placeholder PDF
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("STORED REPORT")
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(100));

        document.add(new Paragraph("Report ID: " + reportId)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20));

        document.add(new Paragraph("This is a placeholder for pre-generated reports.")
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setFontColor(GRAY_TEXT));

        document.close();
        return baos.toByteArray();
    }

    // ═══════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════

    private void addChartImage(Document document, String base64Image) {
        try {
            // Remove data URL prefix if present
            String imageData = base64Image;
            if (imageData.contains(",")) {
                imageData = imageData.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(imageData);
            Image image = new Image(ImageDataFactory.create(imageBytes));
            image.setWidth(UnitValue.createPercentValue(90));
            image.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
            document.add(image);
        } catch (Exception e) {
            document.add(new Paragraph("[Chart image could not be loaded]")
                    .setFontColor(GRAY_TEXT)
                    .setItalic());
        }
    }

    private void addTableHeader(Table table, String... headers) {
        for (String header : headers) {
            Cell cell = new Cell().add(new Paragraph(header).setBold().setFontSize(10))
                    .setBackgroundColor(new DeviceRgb(30, 41, 59))
                    .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                    .setPadding(5);
            table.addHeaderCell(cell);
        }
    }

    private void addFinancialRow(Table table, String metric, int amount, String status) {
        table.addCell(new Cell().add(new Paragraph(metric).setFontSize(10)));
        table.addCell(new Cell().add(new Paragraph("₹" + formatCurrency(amount)).setFontSize(10)));

        Color statusColor = getStatusColorByName(status);
        table.addCell(new Cell().add(new Paragraph(status).setFontSize(9).setFontColor(statusColor)));
    }

    private String formatCurrency(int amount) {
        if (amount >= 10000000)
            return String.format("%.1f Cr", amount / 10000000.0);
        if (amount >= 100000)
            return String.format("%.1f L", amount / 100000.0);
        if (amount >= 1000)
            return String.format("%.1f K", amount / 1000.0);
        return String.valueOf(amount);
    }

    private Color getStatusColor(String status) {
        return switch (status.toLowerCase()) {
            case "critical" -> CRITICAL_COLOR;
            case "high" -> HIGH_COLOR;
            case "medium" -> MEDIUM_COLOR;
            case "low" -> LOW_COLOR;
            default -> GRAY_TEXT;
        };
    }

    private Color getStatusColorByName(String name) {
        return switch (name.toLowerCase()) {
            case "critical", "high" -> CRITICAL_COLOR;
            case "normal" -> LOW_COLOR;
            default -> GRAY_TEXT;
        };
    }

    private Color getAlertColor(String alertType) {
        return switch (alertType.toLowerCase()) {
            case "critical" -> CRITICAL_COLOR;
            case "warning" -> HIGH_COLOR;
            case "info" -> ACCENT_COLOR;
            default -> GRAY_TEXT;
        };
    }

    private String getRiskFlag(String description) {
        String lower = description.toLowerCase();
        if (lower.contains("missed") || lower.contains("failed"))
            return "⚠ Critical";
        if (lower.contains("late") || lower.contains("delayed"))
            return "⚠ High";
        if (lower.contains("loan") || lower.contains("lending"))
            return "⚠ Medium";
        if (lower.contains("atm") || lower.contains("withdrawal"))
            return "⚠ Watch";
        return "✓ Normal";
    }

    private Color getRiskFlagColor(String flag) {
        if (flag.contains("Critical"))
            return CRITICAL_COLOR;
        if (flag.contains("High"))
            return HIGH_COLOR;
        if (flag.contains("Medium"))
            return MEDIUM_COLOR;
        if (flag.contains("Watch"))
            return new DeviceRgb(234, 88, 12);
        return LOW_COLOR;
    }
}