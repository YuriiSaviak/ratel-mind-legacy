package com.ratelmind.backend.controller;

import com.ratelmind.backend.dto.AiAnalysisRequestDto;
import com.ratelmind.backend.dto.AiAnalysisResponseDto;
import com.ratelmind.backend.service.AiAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    @PostMapping("/compare")
    public ResponseEntity<AiAnalysisResponseDto> compare(@RequestBody @Valid AiAnalysisRequestDto dto) {
        return ResponseEntity.ok(aiAnalysisService.analyze(dto));
    }
}
