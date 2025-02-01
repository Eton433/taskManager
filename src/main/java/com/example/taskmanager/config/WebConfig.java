package com.example.taskmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) { // 加上 @NonNull
                registry.addMapping("/**") // 允許所有 API
                        .allowedOrigins("http://localhost:5173") // 允許 React 存取
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // 允許的請求方式
                        .allowCredentials(true); // 允許攜帶 Cookie（如果需要）
            }
        };
    }
}
