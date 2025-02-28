package com.market.risk;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MarketRiskController {

    @GetMapping("/metrics")
    public Map<String, Object> getMetrics(@RequestParam String ticker) {
        String pythonApiUrl = "http://localhost:5000/api/metrics?ticker=" + ticker;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(pythonApiUrl, Map.class);
    }
}
