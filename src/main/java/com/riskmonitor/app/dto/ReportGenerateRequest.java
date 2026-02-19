package com.riskmonitor.app.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportGenerateRequest {
    private String customerId;
    private JsonNode customerData; // Full customer data object
    private Map<String, String> charts; // Chart images as base64 strings
}