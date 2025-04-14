package com.gestion.ticket.gestion_ticket.Request;



import lombok.Data;

@Data
public class TicketRequest {
    
    private String objet;
    private String details;
    private Long demandeurId;
    private Long proprietaireId;
    private Long siteId;
    private Long categorieId;
    private Long urgenceId;
    private String status;

}
