package com.ratelmind.backend.dto;

import java.util.List;

public record AiAnalysisResponseDto(
        String source,
        String model,
        int classicLevel,
        int aiLevel,
        String agreement,
        String summary,
        List<String> strengths,
        List<String> risks,
        List<String> recommendations
) {}
