package com.gestion.ticket.gestion_ticket.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion.ticket.gestion_ticket.Model.Ticket;
import com.gestion.ticket.gestion_ticket.Model.TicketStatus;



@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {

    @Query(value = "SELECT * FROM ticket t " +
                   "WHERE (:objet IS NULL OR LOWER(t.objet) LIKE LOWER(CONCAT('%', :objet, '%'))) " +
                   "AND (:urgenceId IS NULL OR t.urgence_id = :urgenceId) " +
                   "AND (:siteId IS NULL OR t.site_id = :siteId) " +
                   "AND (:categorieId IS NULL OR t.categorie_id = :categorieId) " +
                   "AND (:demandeurId IS NULL OR t.demandeur_id = :demandeurId)",
           nativeQuery = true)
    List<Ticket> searchTickets(
        @Param("objet") String objet,
        @Param("urgenceId") Long urgenceId,
        @Param("siteId") Long siteId,
        @Param("categorieId") Long categorieId,
        @Param("demandeurId") Long demandeurId
    );

    List<Ticket> findByDemandeurId(Long userId);
    List<Ticket> findByProprietaireId(Long userId);
    long countByCreationDateBetween(LocalDate start, LocalDate end);
    long countByResolutionDateBetweenAndStatus(LocalDate start, LocalDate end, TicketStatus status);
    long countByCreationDateBetweenAndStatusIn(LocalDate start, LocalDate end, List<TicketStatus> statuses);


    long countByCreationDateBetweenAndProprietaire_Id(LocalDate start, LocalDate end, Long proprietaireId);
    long countByResolutionDateBetweenAndStatusAndProprietaire_Id(LocalDate start, LocalDate end, TicketStatus status, Long proprietaireId);
    long countByCreationDateBetweenAndStatusInAndProprietaire_Id(LocalDate start, LocalDate end, List<TicketStatus> statuses, Long proprietaireId);

}