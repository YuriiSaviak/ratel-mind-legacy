package com.ratelmind.backend.service;

import com.ratelmind.backend.dto.EmailFormDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailFormsService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${app.email-receiver}")
    private String toAddress;

    public void sendForm(EmailFormDto emailFormDto) {
        var context = new Context();
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", emailFormDto.name());
        variables.put("surname", isBlank(emailFormDto.surname()) ? null : emailFormDto.surname());
        variables.put("email", emailFormDto.email());
        variables.put("phoneNumber", isBlank(emailFormDto.phoneNumber()) ? null : emailFormDto.phoneNumber());
        variables.put("message", emailFormDto.message());
        context.setVariables(variables);
        var body = springTemplateEngine.process("email-form", context);
        var message = mailSender.createMimeMessage();

        try {
            var helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromAddress);
            helper.setTo(toAddress);
            helper.setSubject("Request from a client");
            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception _) {
            log.info("Failed to send email to {} from {} with the message: {}", toAddress, emailFormDto.email(), emailFormDto.message());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Unable to send email.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

}
