package com.gestion.ticket.gestion_ticket.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestion.ticket.gestion_ticket.Model.Urgence;



public interface UrgenceRepository extends JpaRepository<Urgence, Long> {
    Optional<String> findDescriptionById(Long id);
}
