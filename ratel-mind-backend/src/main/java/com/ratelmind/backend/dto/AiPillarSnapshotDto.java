package com.ratelmind.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AiPillarSnapshotDto(
        @NotBlank String pillar,
        @NotNull @Min(0) @Max(60) Integer sum,
        @NotBlank String level,
        @NotNull @Min(0) @Max(100) Integer pct
) {}
