package com.gestion.ticket.gestion_ticket.Request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TicketFormat {
    private Long id;
    private String objet;
    private LocalDate creationDate;
}
