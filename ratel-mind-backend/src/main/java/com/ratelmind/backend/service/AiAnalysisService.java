package com.ratelmind.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ratelmind.backend.dto.AiAnalysisRequestDto;
import com.ratelmind.backend.dto.AiAnalysisResponseDto;
import com.ratelmind.backend.dto.AiPillarSnapshotDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiAnalysisService {

    private final ObjectMapper objectMapper;

    @Value("${openai.api-key:}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-5.4-mini}")
    private String openAiModel;

    @Value("${openrouter.api-key:}")
    private String openRouterApiKey;

    @Value("${openrouter.model:openai/gpt-4o}")
    private String openRouterModel;

    @Value("${openrouter.site-url:}")
    private String openRouterSiteUrl;

    @Value("${openrouter.site-name:Ratel Mind}")
    private String openRouterSiteName;

    @Value("${groq.api-key:}")
    private String groqApiKey;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String groqModel;

    public AiAnalysisResponseDto analyze(AiAnalysisRequestDto dto) {
        try {
            if (StringUtils.hasText(openRouterApiKey)) {
                return callOpenRouter(dto);
            }

            if (StringUtils.hasText(groqApiKey)) {
                return callGroq(dto);
            }

            if (StringUtils.hasText(openAiApiKey)) {
                return callOpenAi(dto);
            }

            return buildFallback(dto, "Brak klucza AI");
        } catch (Exception ex) {
            log.warn("AI analysis failed, using fallback: {}", ex.getMessage(), ex);
            return buildFallback(dto, ex.getMessage());
        }
    }

    private AiAnalysisResponseDto callOpenRouter(AiAnalysisRequestDto dto) throws IOException, InterruptedException {
        String prompt = buildPrompt(dto);

        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", openRouterModel);
        root.put("temperature", 0.2);
        root.put("max_tokens", 900);
        root.putObject("response_format").put("type", "json_object");

        ArrayNode messages = root.putArray("messages");
        ObjectNode systemMessage = messages.addObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", """
                Jestes analitykiem psychologicznym. Na podstawie odpowiedzi uzytkownika i wyniku klasycznego przygotuj alternatywna, AI-wspomagana klasyfikacje odpornosci psychicznej.
                Zwracaj wylacznie poprawny JSON.
                Wymagane pola:
                - aiLevel (integer 1..5)
                - agreement (string: zgodny | bliski | rozny)
                - summary (string)
                - strengths (array of strings)
                - risks (array of strings)
                - recommendations (array of strings)
                Odpowiadaj po polsku.
                """);
        ObjectNode userMessage = messages.addObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create("https://openrouter.ai/api/v1/chat/completions"))
                .timeout(Duration.ofSeconds(45))
                .header("Authorization", "Bearer " + openRouterApiKey)
                .header("Content-Type", "application/json")
                .header("X-Title", openRouterSiteName);

        if (StringUtils.hasText(openRouterSiteUrl)) {
            requestBuilder.header("HTTP-Referer", openRouterSiteUrl);
        }

        HttpRequest request = requestBuilder
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(root)))
                .build();

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("OpenRouter HTTP " + response.statusCode() + ": " + response.body());
        }

        JsonNode rootResponse = objectMapper.readTree(response.body());
        String outputText = rootResponse.path("choices").path(0).path("message").path("content").asText("");
        if (!StringUtils.hasText(outputText)) {
            throw new IllegalStateException("OpenRouter response does not contain message.content");
        }

        JsonNode parsed = objectMapper.readTree(outputText);
        int aiResultLevel = parsed.path("aiLevel").asInt(dto.classicLevel());
        String agreementValue = parsed.path("agreement").asText(buildAgreement(dto.classicLevel(), aiResultLevel));
        String summaryValue = parsed.path("summary").asText("AI nie zwrocilo opisu.");

        return new AiAnalysisResponseDto(
                "openrouter",
                openRouterModel,
                dto.classicLevel(),
                aiResultLevel,
                agreementValue,
                summaryValue,
                readStringArray(parsed.path("strengths")),
                readStringArray(parsed.path("risks")),
                readStringArray(parsed.path("recommendations"))
        );
    }

    private AiAnalysisResponseDto callGroq(AiAnalysisRequestDto dto) throws IOException, InterruptedException {
        String prompt = buildPrompt(dto);

        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", groqModel);
        root.put("temperature", 0.2);
        root.put("max_tokens", 900);
        root.putObject("response_format").put("type", "json_object");

        ArrayNode messages = root.putArray("messages");
        ObjectNode systemMessage = messages.addObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", """
                Jestes analitykiem psychologicznym. Na podstawie odpowiedzi uzytkownika i wyniku klasycznego przygotuj alternatywna, AI-wspomagana klasyfikacje odpornosci psychicznej.
                Zwracaj wylacznie poprawny JSON.
                Wymagane pola:
                - aiLevel (integer 1..5)
                - agreement (string: zgodny | bliski | rozny)
                - summary (string)
                - strengths (array of strings)
                - risks (array of strings)
                - recommendations (array of strings)
                Odpowiadaj po polsku.
                """);
        ObjectNode userMessage = messages.addObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                .timeout(Duration.ofSeconds(45))
                .header("Authorization", "Bearer " + groqApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(root)))
                .build();

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("Groq HTTP " + response.statusCode() + ": " + response.body());
        }

        JsonNode rootResponse = objectMapper.readTree(response.body());
        String outputText = rootResponse.path("choices").path(0).path("message").path("content").asText("");
        if (!StringUtils.hasText(outputText)) {
            throw new IllegalStateException("Groq response does not contain message.content");
        }

        JsonNode parsed = objectMapper.readTree(outputText);
        int aiResultLevel = parsed.path("aiLevel").asInt(dto.classicLevel());
        String agreementValue = parsed.path("agreement").asText(buildAgreement(dto.classicLevel(), aiResultLevel));
        String summaryValue = parsed.path("summary").asText("AI nie zwrocilo opisu.");

        return new AiAnalysisResponseDto(
                "groq",
                groqModel,
                dto.classicLevel(),
                aiResultLevel,
                agreementValue,
                summaryValue,
                readStringArray(parsed.path("strengths")),
                readStringArray(parsed.path("risks")),
                readStringArray(parsed.path("recommendations"))
        );
    }

    private AiAnalysisResponseDto callOpenAi(AiAnalysisRequestDto dto) throws IOException, InterruptedException {
        String prompt = buildPrompt(dto);

        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("type", "object");
        ObjectNode properties = schema.putObject("properties");

        ObjectNode aiLevel = properties.putObject("aiLevel");
        aiLevel.put("type", "integer");
        aiLevel.put("minimum", 1);
        aiLevel.put("maximum", 5);

        ObjectNode agreement = properties.putObject("agreement");
        agreement.put("type", "string");
        ArrayNode agreementEnum = agreement.putArray("enum");
        agreementEnum.add("zgodny");
        agreementEnum.add("bliski");
        agreementEnum.add("rozny");

        ObjectNode summary = properties.putObject("summary");
        summary.put("type", "string");

        ObjectNode strengths = properties.putObject("strengths");
        strengths.put("type", "array");
        strengths.putObject("items").put("type", "string");

        ObjectNode risks = properties.putObject("risks");
        risks.put("type", "array");
        risks.putObject("items").put("type", "string");

        ObjectNode recommendations = properties.putObject("recommendations");
        recommendations.put("type", "array");
        recommendations.putObject("items").put("type", "string");

        ArrayNode required = schema.putArray("required");
        required.add("aiLevel");
        required.add("agreement");
        required.add("summary");
        required.add("strengths");
        required.add("risks");
        required.add("recommendations");
        schema.put("additionalProperties", false);

        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", openAiModel);
        root.put("instructions", "Jestes analitykiem psychologicznym. Na podstawie odpowiedzi uzytkownika i wyniku klasycznego przygotuj alternatywna, AI-wspomagana klasyfikacje odpornosci psychicznej. Zwracaj tylko wynik zgodny ze schematem JSON. Odpowiadaj po polsku.");
        root.put("input", prompt);

        ObjectNode text = root.putObject("text");
        ObjectNode format = text.putObject("format");
        format.put("type", "json_schema");
        format.put("name", "ai_resilience_analysis");
        format.put("strict", true);
        format.set("schema", schema);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/responses"))
                .timeout(Duration.ofSeconds(45))
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(root)))
                .build();

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("OpenAI HTTP " + response.statusCode() + ": " + response.body());
        }

        JsonNode rootResponse = objectMapper.readTree(response.body());
        String outputText = rootResponse.path("output_text").asText("");
        if (!StringUtils.hasText(outputText)) {
            throw new IllegalStateException("OpenAI response does not contain output_text");
        }

        JsonNode parsed = objectMapper.readTree(outputText);
        int aiResultLevel = parsed.path("aiLevel").asInt(dto.classicLevel());
        String agreementValue = parsed.path("agreement").asText(buildAgreement(dto.classicLevel(), aiResultLevel));
        String summaryValue = parsed.path("summary").asText("AI nie zwrocilo opisu.");

        return new AiAnalysisResponseDto(
                "openai",
                openAiModel,
                dto.classicLevel(),
                aiResultLevel,
                agreementValue,
                summaryValue,
                readStringArray(parsed.path("strengths")),
                readStringArray(parsed.path("risks")),
                readStringArray(parsed.path("recommendations"))
        );
    }

    private List<String> readStringArray(JsonNode node) {
        List<String> values = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode item : node) {
                if (item.isTextual()) {
                    values.add(item.asText());
                }
            }
        }
        return values;
    }

    private String buildPrompt(AiAnalysisRequestDto dto) {
        StringBuilder builder = new StringBuilder();
        builder.append("Przeanalizuj wynik testu odpornosci psychicznej.\n\n");
        builder.append("Wynik klasyczny:\n");
        builder.append("- wynik laczny: ").append(dto.totalScore()).append("/240\n");
        builder.append("- poziom klasyczny: ").append(dto.classicLevel()).append("\n");
        builder.append("- filary:\n");
        for (AiPillarSnapshotDto pillar : dto.pillars()) {
            builder.append("  - ")
                    .append(localizePillarName(pillar.pillar()))
                    .append(": ")
                    .append(pillar.sum()).append("/60, poziom ")
                    .append(localizeLevel(pillar.level()))
                    .append(", ").append(pillar.pct()).append("%\n");
        }

        builder.append("\nOdpowiedzi uzytkownika (1-5):\n");
        for (var item : dto.responses()) {
            builder.append(item.id()).append(". ")
                    .append(item.text())
                    .append(" -> ")
                    .append(item.answer())
                    .append("\n");
        }

        builder.append("\nZadanie:\n");
        builder.append("1. Okresl alternatywny poziom AI w skali 1-5.\n");
        builder.append("2. Ocen, czy AI zgadza sie z algorytmem klasycznym (zgodny/bliski/rozny).\n");
        builder.append("3. Przygotuj krotkie podsumowanie po polsku.\n");
        builder.append("4. Wypisz najwazniejsze mocne strony.\n");
        builder.append("5. Wypisz glówne obszary ryzyka.\n");
        builder.append("6. Zaproponuj praktyczne rekomendacje.\n");
        return builder.toString();
    }

    private AiAnalysisResponseDto buildFallback(AiAnalysisRequestDto dto, String reason) {
        List<AiPillarSnapshotDto> sorted = dto.pillars().stream()
                .sorted(Comparator.comparingInt(AiPillarSnapshotDto::sum).reversed())
                .toList();

        List<String> strengths = new ArrayList<>();
        List<String> risks = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (!sorted.isEmpty()) {
            strengths.add("Najsilniejszy filar to " + localizePillarName(sorted.get(0).pillar()).toLowerCase(Locale.ROOT) + ".");
        }
        if (sorted.size() > 1) {
            strengths.add("Drugim mocnym obszarem jest " + localizePillarName(sorted.get(1).pillar()).toLowerCase(Locale.ROOT) + ".");
        }

        List<AiPillarSnapshotDto> ascending = dto.pillars().stream()
                .sorted(Comparator.comparingInt(AiPillarSnapshotDto::sum))
                .toList();

        if (!ascending.isEmpty()) {
            risks.add("Najwiekszego wsparcia wymaga filar " + localizePillarName(ascending.get(0).pillar()).toLowerCase(Locale.ROOT) + ".");
            recommendations.add(buildRecommendation(ascending.get(0).pillar()));
        }
        if (ascending.size() > 1) {
            risks.add("Drugim obszarem rozwoju jest " + localizePillarName(ascending.get(1).pillar()).toLowerCase(Locale.ROOT) + ".");
            recommendations.add(buildRecommendation(ascending.get(1).pillar()));
        }

        recommendations.add("Porównaj wynik AI z wynikiem klasycznym i sprawdz, czy obie metody wskazuja ten sam priorytet rozwojowy.");

        String summary = "To demonstracyjna analiza AI oparta na profilu wynikow. System klasyczny wskazuje poziom %d, a analiza AI podkresla przede wszystkim relacje miedzy filarami oraz obszary wymagajace wsparcia. Tryb fallback zostal uzyty, poniewaz %s."
                .formatted(dto.classicLevel(), normalizeReason(reason));

        return new AiAnalysisResponseDto(
                "fallback",
                "demo-fallback",
                dto.classicLevel(),
                dto.classicLevel(),
                "zgodny",
                summary,
                strengths,
                risks,
                recommendations
        );
    }

    private String buildRecommendation(String pillar) {
        return switch (pillar) {
            case "Cognitive" -> "Wzmacniaj elastycznosc poznawcza i analize sytuacji przez regularna autorefleksje i prace na scenariuszach.";
            case "Emotional" -> "Rozwijaj regulacje emocjonalna i regeneracje przez techniki oddechowe, odpoczynek i swiadome zatrzymanie.";
            case "Behavioral" -> "Pracuj nad konsekwencja dzialania i podejmowaniem decyzji, rozbijajac cele na male kroki.";
            case "Social" -> "Wzmacniaj siec wsparcia, asertywnosc i komunikacje w relacjach.";
            default -> "Warto przyjrzec sie temu obszarowi i dobrac konkretne cwiczenia rozwojowe.";
        };
    }

    private String localizePillarName(String pillar) {
        return switch (pillar) {
            case "Cognitive" -> "Poznawczy";
            case "Emotional" -> "Emocjonalny";
            case "Behavioral" -> "Behawioralny";
            case "Social" -> "Spoleczny";
            default -> pillar;
        };
    }

    private String localizeLevel(String level) {
        return switch (level) {
            case "Low" -> "niski";
            case "Medium" -> "sredni";
            case "High" -> "wysoki";
            default -> level;
        };
    }

    private String normalizeReason(String reason) {
        if (!StringUtils.hasText(reason)) {
            return "brak klucza API lub odpowiedzi modelu";
        }
        return reason.toLowerCase(Locale.ROOT);
    }

    private String buildAgreement(int classicLevel, int aiLevel) {
        int diff = Math.abs(classicLevel - aiLevel);
        if (diff == 0) {
            return "zgodny";
        }
        if (diff == 1) {
            return "bliski";
        }
        return "rozny";
    }
}
