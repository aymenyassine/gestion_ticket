package com.gestion.ticket.gestion_ticket.Model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Urgence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    @OneToMany(mappedBy = "urgence", cascade = CascadeType.ALL)
    private List<Ticket> tikets;
}
