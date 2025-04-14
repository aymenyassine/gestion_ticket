package com.gestion.ticket.gestion_ticket.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String firstname;
    private String lastname;
    private String role;
    private List<TicketFormat> ticketsDemandes;
    private List<TicketFormat> ticketsProprietes;


    public String getFullName() {
        return firstname + " " + lastname;
    }
}