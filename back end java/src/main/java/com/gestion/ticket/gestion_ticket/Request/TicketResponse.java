package com.gestion.ticket.gestion_ticket.Request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
	
	 	private String objet;
	    private String details;
	    private UserResponse demandeur; 
	    private UserResponse proprietaire;
	    private SiteResponse site;
	    private CategorieResponse categorie;
	    private UrgenceResponse urgence;
	    private LocalDate creationDate;
	    private TicketStatusResponse status;
}