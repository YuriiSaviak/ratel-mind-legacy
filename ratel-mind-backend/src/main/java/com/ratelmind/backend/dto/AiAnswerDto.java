package com.ratelmind.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AiAnswerDto(
        @NotNull Integer id,
        @NotBlank String text,
        @NotNull @Min(1) @Max(5) Integer answer
) {}
