package com.gestion.ticket.gestion_ticket.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestion.ticket.gestion_ticket.Model.Categorie;



public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    Optional<String> findDescriptionById(Long id);
}
