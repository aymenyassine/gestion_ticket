package com.gestion.ticket.gestion_ticket.Request;

import lombok.Builder;

@Builder
public record CategorieResponse(Long id, String description) {}
