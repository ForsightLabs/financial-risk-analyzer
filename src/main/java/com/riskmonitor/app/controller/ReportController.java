package com.riskmonitor.app.controller;

import com.riskmonitor.app.dto.ReportGenerateRequest;
import com.riskmonitor.app.dto.BulkReportRequest;
import com.riskmonitor.app.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = { "http://localhost:3000", "https://financial-risk-analyzer-barclay-degiwn5ek.vercel.app" })
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Generate individual customer report with charts
     * Called from customer profile page
     */
    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateCustomerReport(@RequestBody ReportGenerateRequest request) {
        try {
            byte[] pdfBytes = reportService.generateCustomerReport(
                    request.getCustomerId(),
                    request.getCustomerData(),
                    request.getCharts());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment",
                    request.getCustomerData().get("profile").get("name").asText()
                            .replace(" ", "-").toLowerCase() + "-report.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate bulk report for multiple customers
     * Called from reports page "Generate Report" button
     */
    @PostMapping("/bulk-generate")
    public ResponseEntity<byte[]> generateBulkReport(@RequestBody BulkReportRequest request) {
        try {
            byte[] pdfBytes = reportService.generateBulkReport(
                    request.getCustomerIds(),
                    request.getReportType(),
                    request.getGeneratedBy());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment",
                    "critical-customers-report-" + System.currentTimeMillis() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download pre-generated report
     * Called from reports page table rows
     */
    @GetMapping("/download/{reportId}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String reportId) {
        try {
            // For now, return a placeholder
            // In production, fetch from database or file storage
            byte[] pdfBytes = reportService.getStoredReport(reportId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment",
                    "report-" + reportId + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}