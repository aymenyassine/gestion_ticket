package com.gestion.ticket.gestion_ticket.Request;

import lombok.Builder;

@Builder
public record UrgenceResponse(Long id, String description) {}
