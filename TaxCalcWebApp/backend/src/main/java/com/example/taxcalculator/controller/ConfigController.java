package com.example.taxcalculator.controller;

import com.example.taxcalculator.config.AppConfig;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {
    private final AppConfig appConfig;

    public ConfigController(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    @GetMapping
    public Map<String, String> getConfig() {
        return Map.of(
            "backendUrl", appConfig.getBackendUrl(),
            "frontendUrl", appConfig.getFrontendUrl()
        );
    }
}
