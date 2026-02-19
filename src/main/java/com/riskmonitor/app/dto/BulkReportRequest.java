package com.riskmonitor.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkReportRequest {
    private List<String> customerIds;
    private String reportType;
    private String generatedBy;
}