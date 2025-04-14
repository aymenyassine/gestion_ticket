package com.gestion.ticket.gestion_ticket.Request;

public record MonthlyTicketStats(int month, int createdCount, int resolvedCount, int inProgressCount) {}