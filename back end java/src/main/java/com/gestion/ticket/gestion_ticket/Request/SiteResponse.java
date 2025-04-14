package com.gestion.ticket.gestion_ticket.Request;

import lombok.Builder;

@Builder
public record SiteResponse(Long id, String description) {}

