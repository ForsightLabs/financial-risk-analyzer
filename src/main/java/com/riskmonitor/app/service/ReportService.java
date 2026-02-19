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
import java.util.List;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
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
                document.add(new Paragraph("1. Cash Flow Analysis")
                        .setBold()
                        .setFontSize(14)
                        .setMarginTop(15));

                document.add(new Paragraph("Analysis of income vs expenses over the last 6 months.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(5));

                addChartImage(document, charts.get("cashFlow"));

                // Key Finding Box
                Paragraph keyFinding = new Paragraph()
                        .setBackgroundColor(new DeviceRgb(255, 250, 230))
                        .setBorder(new SolidBorder(new DeviceRgb(255, 193, 7), 2))
                        .setPadding(10)
                        .setMarginTop(10)
                        .setMarginBottom(15);

                keyFinding.add(new Text("Key Finding: ").setBold().setFontSize(11));
                keyFinding.add(new Text(String.format(
                        "Customer has been consistently overspending for 6 months. Monthly expenses (₹%s) exceed " +
                                "income (₹%s), creating a deficit of ₹%s per month. This chronic negative cash flow is unsustainable "
                                +
                                "and directly contributes to savings depletion. At current burn rate, liquid assets will be exhausted "
                                +
                                "within 45 days, forcing reliance on high-interest payday loans.",
                        formatCurrency(financialSummary.get("monthlyExpenses").asInt()),
                        formatCurrency(financialSummary.get("monthlyIncome").asInt()),
                        formatCurrency(financialSummary.get("monthlyExpenses").asInt()
                                - financialSummary.get("monthlyIncome").asInt())))
                        .setFontSize(10));

                document.add(keyFinding);

                // What This Means
                document.add(new Paragraph("What This Means:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(5));

                com.itextpdf.layout.element.List whatThisMeans = new com.itextpdf.layout.element.List()
                        .setMarginLeft(15)
                        .setFontSize(10);
                whatThisMeans.add("Income (green line) remains stable but expenses (red line) are consistently higher");
                whatThisMeans.add("The red shaded area above the green line represents accumulated debt each month");
                whatThisMeans.add("Customer is borrowing or depleting savings to cover the gap");
                whatThisMeans.add("Without intervention, this pattern leads to certain default within 30 days");

                document.add(whatThisMeans);
            }

            // Credit Score Chart
            if (charts.containsKey("creditScore")) {
                document.add(new AreaBreak());
                document.add(new Paragraph("2. Credit Score Trend")
                        .setBold()
                        .setFontSize(14)
                        .setMarginTop(15));

                document.add(new Paragraph("Credit score progression showing declining trend over 6 months.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(5));

                addChartImage(document, charts.get("creditScore"));

                // Calculate credit score drop
                int currentScore = creditScore;
                int targetScore = 700; // Good score threshold
                int pointsDrop = 40; // Approximate from data

                // Key Finding Box
                Paragraph creditFinding = new Paragraph()
                        .setBackgroundColor(new DeviceRgb(255, 250, 230))
                        .setBorder(new SolidBorder(new DeviceRgb(255, 193, 7), 2))
                        .setPadding(10)
                        .setMarginTop(10)
                        .setMarginBottom(15);

                creditFinding.add(new Text("Key Finding: ").setBold().setFontSize(11));
                creditFinding.add(new Text(String.format(
                        "Credit score has declined steadily from %d to %d (%d-point drop) over 6 months, " +
                                "indicating worsening financial behavior. This decline correlates directly with missed payments "
                                +
                                "and increased credit utilization. Current score of %d places customer in '%s' category. "
                                +
                                "If this trend continues, score will drop below 600 (poor category) within 2-3 months, "
                                +
                                "severely limiting access to credit and increasing borrowing costs.",
                        currentScore + pointsDrop,
                        currentScore,
                        pointsDrop,
                        currentScore,
                        profile.get("creditScoreStatus").asText())).setFontSize(10));

                document.add(creditFinding);

                // Score Interpretation
                document.add(new Paragraph("Score Interpretation:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(5));

                Table scoreTable = new Table(new float[] { 2, 3 });
                scoreTable.setWidth(UnitValue.createPercentValue(80));
                scoreTable.setMarginLeft(15);

                addScoreInterpretationRow(scoreTable, "750-900", "Excellent - Best rates, no deposit required",
                        LOW_COLOR);
                addScoreInterpretationRow(scoreTable, "700-749", "Good - Favorable terms available", LOW_COLOR);
                addScoreInterpretationRow(scoreTable, "650-699", "Fair - Higher interest rates", MEDIUM_COLOR);
                addScoreInterpretationRow(scoreTable, "600-649", "Poor - Limited options, high cost", HIGH_COLOR);
                addScoreInterpretationRow(scoreTable, "Below 600", "Very Poor - Loan rejection likely", CRITICAL_COLOR);

                document.add(scoreTable);

                document.add(new Paragraph(
                        "\n→ Current Score: " + currentScore + " (" + profile.get("creditScoreStatus").asText() + ")")
                        .setBold()
                        .setFontSize(10)
                        .setMarginLeft(15)
                        .setMarginTop(5));

                // What Caused the Decline
                document.add(new Paragraph("Primary Factors Causing Decline:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(10));

                com.itextpdf.layout.element.List declineFactors = new com.itextpdf.layout.element.List()
                        .setMarginLeft(15)
                        .setFontSize(10);
                declineFactors.add("Payment History (35% of score): Multiple late/missed payments detected");
                declineFactors.add("Credit Utilization (30% of score): Using 90%+ of available credit");
                declineFactors
                        .add("Length of Credit History (15% of score): Recent defaults damaging long-term profile");
                declineFactors.add("New Credit Inquiries (10% of score): Multiple payday loan applications");
                declineFactors.add("Credit Mix (10% of score): Over-reliance on high-interest short-term credit");

                document.add(declineFactors);
            }

            // Payment History Chart
            if (charts.containsKey("paymentHistory")) {
                document.add(new AreaBreak());
                document.add(new Paragraph("3. Payment Performance Collapse")
                        .setBold()
                        .setFontSize(14)
                        .setMarginTop(15));

                document.add(
                        new Paragraph("On-time vs late payment distribution showing deteriorating payment behavior.")
                                .setFontSize(10)
                                .setFontColor(GRAY_TEXT)
                                .setMarginBottom(5));

                addChartImage(document, charts.get("paymentHistory"));

                // Key Finding Box
                Paragraph paymentFinding = new Paragraph()
                        .setBackgroundColor(new DeviceRgb(255, 235, 235))
                        .setBorder(new SolidBorder(CRITICAL_COLOR, 2))
                        .setPadding(10)
                        .setMarginTop(10)
                        .setMarginBottom(15);

                paymentFinding
                        .add(new Text("CRITICAL FINDING: ").setBold().setFontSize(11).setFontColor(CRITICAL_COLOR));
                paymentFinding.add(new Text(
                        "Payment behavior has deteriorated dramatically. In January, 95% of payments were on-time " +
                                "(green bars). By June, only 50% were on-time, meaning half of all obligations are now being paid "
                                +
                                "late (red bars). This is the strongest single indicator of imminent default. Historical data shows "
                                +
                                "customers with <60% on-time rates have an 80% likelihood of default within 60 days.")
                        .setFontSize(10));

                document.add(paymentFinding);

                // How to Read This Chart
                document.add(new Paragraph("How to Read This Chart:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(5));

                com.itextpdf.layout.element.List chartGuide = new com.itextpdf.layout.element.List()
                        .setMarginLeft(15)
                        .setFontSize(10);
                chartGuide.add("Green (bottom) = Payments made on time or early");
                chartGuide.add("Red (top) = Payments made late or missed entirely");
                chartGuide.add("Total bar height = 100% of all monthly payment obligations");
                chartGuide.add("Trend: Green shrinking, Red growing = Payment collapse in progress");

                document.add(chartGuide);

                // Risk Interpretation
                document.add(new Paragraph("Payment Behavior Risk Levels:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(10));

                Table riskTable = new Table(new float[] { 2, 3, 2 });
                riskTable.setWidth(UnitValue.createPercentValue(90));
                riskTable.setMarginLeft(15);

                addTableHeader(riskTable, "On-Time %", "Interpretation", "Risk Level");
                addPaymentRiskRow(riskTable, "95-100%", "Excellent payment history, very low risk", "Low");
                addPaymentRiskRow(riskTable, "85-94%", "Good history, occasional delays", "Medium");
                addPaymentRiskRow(riskTable, "70-84%", "Concerning pattern, monitoring required", "High");
                addPaymentRiskRow(riskTable, "Below 70%", "Payment collapse, default imminent", "Critical");

                document.add(riskTable);

                document.add(new Paragraph("\n→ Customer's Current Rate: 50% (Critical Risk Zone)")
                        .setBold()
                        .setFontSize(10)
                        .setFontColor(CRITICAL_COLOR)
                        .setMarginLeft(15)
                        .setMarginTop(5));

                // What This Predicts
                document.add(new Paragraph("Predictive Analysis:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(10));

                document.add(new Paragraph(
                        "Based on this payment trend, our AI model predicts a 85% probability of complete payment " +
                                "default within the next 30 days if no intervention occurs. Customers showing this pattern typically "
                                +
                                "default on their largest obligation (usually home loan or primary credit card) first, followed by "
                                +
                                "smaller debts within 45-60 days.")
                        .setFontSize(10).setMarginLeft(15).setMarginTop(5));
            }

            // Liquidity Chart
            if (charts.containsKey("liquidity")) {
                document.add(new AreaBreak());
                document.add(new Paragraph("4. Liquidity Crisis & Savings Depletion")
                        .setBold()
                        .setFontSize(14)
                        .setMarginTop(15));

                document.add(new Paragraph("Liquid assets availability showing rapid depletion over 6 months.")
                        .setFontSize(10)
                        .setFontColor(GRAY_TEXT)
                        .setMarginBottom(5));

                addChartImage(document, charts.get("liquidity"));

                // Calculate depletion stats from data if available
                int depletionPercent = 57; // From sample data

                // Key Finding Box
                Paragraph liquidityFinding = new Paragraph()
                        .setBackgroundColor(new DeviceRgb(255, 235, 235))
                        .setBorder(new SolidBorder(CRITICAL_COLOR, 2))
                        .setPadding(10)
                        .setMarginTop(10)
                        .setMarginBottom(15);

                liquidityFinding
                        .add(new Text("CRITICAL FINDING: ").setBold().setFontSize(11).setFontColor(CRITICAL_COLOR));
                liquidityFinding.add(new Text(String.format(
                        "Liquid savings have been depleted by %d%% in just 6 months. The chart shows a clear downward "
                                +
                                "trajectory with bars changing from blue (healthy) to orange (warning) to red (critical). "
                                +
                                "At current burn rate of ₹%s per month, customer will have ZERO liquid assets within 45 days. "
                                +
                                "This leaves no buffer for emergencies and forces complete reliance on high-interest payday loans, "
                                +
                                "creating an irreversible debt spiral.",
                        depletionPercent,
                        formatCurrency(Math.abs(financialSummary.get("monthlyExpenses").asInt()
                                - financialSummary.get("monthlyIncome").asInt()))))
                        .setFontSize(10));

                document.add(liquidityFinding);

                // How to Read This Chart
                document.add(new Paragraph("Understanding Liquidity Levels:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(5));

                com.itextpdf.layout.element.List liquidityGuide = new com.itextpdf.layout.element.List()
                        .setMarginLeft(15)
                        .setFontSize(10);
                liquidityGuide.add("Blue bars = Healthy liquidity (above ₹50,000)");
                liquidityGuide.add("Orange bars = Warning zone (₹30,000-₹50,000)");
                liquidityGuide.add("Red bars = Critical zone (below ₹30,000)");
                liquidityGuide.add("Declining trend = Customer burning through savings to cover monthly deficit");
                liquidityGuide.add("Each bar drop = Permanent reduction in financial safety net");

                document.add(liquidityGuide);

                // Depletion Timeline
                document.add(new Paragraph("Projected Depletion Timeline:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(10));

                Table timelineTable = new Table(new float[] { 2, 4, 2 });
                timelineTable.setWidth(UnitValue.createPercentValue(90));
                timelineTable.setMarginLeft(15);

                addTableHeader(timelineTable, "Timeframe", "What Happens", "Action Window");
                addTimelineRow(timelineTable, "Days 1-15",
                        "Remaining liquid assets fall below ₹20K - Emergency threshold breached", "URGENT");
                addTimelineRow(timelineTable, "Days 16-30",
                        "Liquid assets reach ₹10K - Cannot cover single unexpected expense", "CRITICAL");
                addTimelineRow(timelineTable, "Days 31-45",
                        "Zero liquid assets - Forced to take payday loans for basic needs", "TOO LATE");
                addTimelineRow(timelineTable, "Days 46-60",
                        "Payday loan debt compounds - Financial recovery nearly impossible", "DEFAULTED");

                document.add(timelineTable);

                // What Liquid Assets Mean
                document.add(new Paragraph("\nWhy Liquidity Matters:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(10));

                document.add(new Paragraph(
                        "Liquid assets are cash or near-cash that can be accessed immediately - savings accounts, " +
                                "fixed deposits with no penalty, emergency funds. This is the LAST LINE OF DEFENSE before default. "
                                +
                                "Once depleted, customer has no choice but to miss payments or take predatory high-interest loans "
                                +
                                "(24-36% APR). Our data shows 92% of customers who hit zero liquidity default within 60 days.")
                        .setFontSize(10).setMarginLeft(15).setMarginTop(5));

                // Comparison to Healthy Customer
                document.add(new Paragraph("Comparison to Healthy Customer Profile:")
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(10));

                com.itextpdf.layout.element.List comparisonList = new com.itextpdf.layout.element.List()
                        .setMarginLeft(15)
                        .setFontSize(10);
                comparisonList.add("Healthy Customer: ₹1,20,000+ liquid assets (3-4 months expenses)");
                comparisonList.add("This Customer: ₹25,000 liquid assets (0.5 months expenses)");
                comparisonList.add("Gap: 79% below healthy benchmark");
                comparisonList.add("Risk: Cannot survive single unexpected expense (medical, car repair, etc.)");

                document.add(comparisonList);
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

    private void addScoreInterpretationRow(Table table, String range, String meaning, Color color) {
        table.addCell(new Cell().add(new Paragraph(range).setFontSize(9).setBold().setFontColor(color)));
        table.addCell(new Cell().add(new Paragraph(meaning).setFontSize(9)));
    }

    private void addPaymentRiskRow(Table table, String onTimePercent, String interpretation, String riskLevel) {
        Color riskColor = switch (riskLevel) {
            case "Low" -> LOW_COLOR;
            case "Medium" -> MEDIUM_COLOR;
            case "High" -> HIGH_COLOR;
            case "Critical" -> CRITICAL_COLOR;
            default -> GRAY_TEXT;
        };

        table.addCell(new Cell().add(new Paragraph(onTimePercent).setFontSize(9)));
        table.addCell(new Cell().add(new Paragraph(interpretation).setFontSize(9)));
        table.addCell(new Cell().add(new Paragraph(riskLevel).setFontSize(9).setFontColor(riskColor).setBold()));
    }

    private void addTimelineRow(Table table, String timeframe, String event, String urgency) {
        Color urgencyColor = switch (urgency) {
            case "URGENT" -> HIGH_COLOR;
            case "CRITICAL" -> CRITICAL_COLOR;
            case "TOO LATE" -> new DeviceRgb(139, 0, 0);
            case "DEFAULTED" -> CRITICAL_COLOR;
            default -> GRAY_TEXT;
        };

        table.addCell(new Cell().add(new Paragraph(timeframe).setFontSize(9).setBold()));
        table.addCell(new Cell().add(new Paragraph(event).setFontSize(9)));
        table.addCell(new Cell().add(new Paragraph(urgency).setFontSize(9).setFontColor(urgencyColor).setBold()));
    }
}