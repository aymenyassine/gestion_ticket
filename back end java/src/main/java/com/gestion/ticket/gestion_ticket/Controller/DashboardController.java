package com.gestion.ticket.gestion_ticket.Controller;

import java.time.Year;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion.ticket.gestion_ticket.Request.MonthlyTicketStats;
import com.gestion.ticket.gestion_ticket.Service.TicketService;

import lombok.AllArgsConstructor;


@AllArgsConstructor
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TicketService ticketService;

    @GetMapping("/monthly-stats")
    public ResponseEntity<List<MonthlyTicketStats>> getMonthlyStats(
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "assigneeId", required = false) Long assigneeId) {
        if (year == null) {
            year = Year.now().getValue();
        }
        List<MonthlyTicketStats> stats = ticketService.getMonthlyTicketStatistics(year, assigneeId);
        return ResponseEntity.ok(stats);
    }
}
