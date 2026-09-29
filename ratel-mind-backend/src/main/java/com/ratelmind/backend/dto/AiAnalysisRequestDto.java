package com.ratelmind.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;

import java.util.List;

public record AiAnalysisRequestDto(
        @NotNull @Min(48) @Max(240) Integer totalScore,
        @Range(min = 1, max = 5) int classicLevel,
        @NotNull @Size(min = 48, max = 48) List<@Valid AiAnswerDto> responses,
        @NotNull @Size(min = 4, max = 4) List<@Valid AiPillarSnapshotDto> pillars
) {}
