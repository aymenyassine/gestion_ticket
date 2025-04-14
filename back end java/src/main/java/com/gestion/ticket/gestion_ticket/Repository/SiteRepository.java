package com.gestion.ticket.gestion_ticket.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestion.ticket.gestion_ticket.Model.Site;


public interface SiteRepository extends JpaRepository<Site, Long> {
    Optional<String> findDescriptionById(Long id);
}
