package com.gestion.ticket.gestion_ticket.Model;

import java.time.LocalDate;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String objet;
    private String details;
    private LocalDate creationDate;
    
    @ManyToOne
    @JoinColumn(name = "demandeur_id")
    private User demandeur;
    
    @ManyToOne
    @JoinColumn(name = "proprietaire_id")
    private User proprietaire;
    
    @ManyToOne
    @JoinColumn(name = "site_id")
    private Site site;
    
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
    
    @ManyToOne
    @JoinColumn(name = "urgence_id")
    private Urgence urgence;
    
    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private LocalDate resolutionDate;

    public Ticket(String objet, String details, User demandeur, User proprietaire, Site site, Categorie categorie, Urgence urgence,TicketStatus status) {
        this.objet = objet;
        this.details = details;
        this.demandeur = demandeur;
        this.proprietaire = proprietaire;
        this.site = site;
        this.categorie = categorie;
        this.urgence = urgence;
        this.creationDate  =  LocalDate.now();
        this.status = status;
        this.resolutionDate = null;
    }
}