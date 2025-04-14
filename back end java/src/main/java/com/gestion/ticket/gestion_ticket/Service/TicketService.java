package com.gestion.ticket.gestion_ticket.Service;

import com.gestion.ticket.gestion_ticket.Model.*;
import com.gestion.ticket.gestion_ticket.Repository.*;
import com.gestion.ticket.gestion_ticket.Request.CategorieResponse;
import com.gestion.ticket.gestion_ticket.Request.MonthlyTicketStats;
import com.gestion.ticket.gestion_ticket.Request.SiteResponse;
import com.gestion.ticket.gestion_ticket.Request.TicketRequest;
import com.gestion.ticket.gestion_ticket.Request.TicketResponse;
import com.gestion.ticket.gestion_ticket.Request.TicketStatusResponse;
import com.gestion.ticket.gestion_ticket.Request.UrgenceResponse;
import com.gestion.ticket.gestion_ticket.Request.UserResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SiteRepository siteRepository;
    private final CategorieRepository categorieRepository;
    private final UrgenceRepository urgenceRepository;

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        return mapToResponse(ticket);
    }

    @Transactional
    public TicketResponse createTicket(TicketRequest request) {
        // Validation des champs obligatoires
        if (request.getObjet() == null || request.getObjet().isEmpty()) {
            request.setObjet("Sans titre"); // Valeur par défaut
        }

        User demandeur = userRepository.findById(request.getDemandeurId())
                .orElseThrow(() -> new RuntimeException("Demandeur non trouvé"));

        Ticket ticket = new Ticket();
        ticket.setObjet(request.getObjet());
        ticket.setDetails(request.getDetails());
        ticket.setDemandeur(demandeur);
        ticket.setProprietaire(getUser(request.getProprietaireId()));
        ticket.setSite(getSite(request.getSiteId()));
        ticket.setCategorie(getCategorie(request.getCategorieId()));
        ticket.setUrgence(getUrgence(request.getUrgenceId()));
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            ticket.setStatus(getTicketStatus(request.getStatus()));
        } else {
            ticket.setStatus(TicketStatus.NOUVEAU);
        }
        ticket.setCreationDate(LocalDate.now());
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    @Transactional
    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket existingTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        LocalDate creationDate = existingTicket.getCreationDate();
        existingTicket.setObjet(request.getObjet());
        existingTicket.setDetails(request.getDetails());
        existingTicket.setProprietaire(getUser(request.getProprietaireId()));
        existingTicket.setSite(getSite(request.getSiteId()));
        existingTicket.setCategorie(getCategorie(request.getCategorieId()));
        existingTicket.setUrgence(getUrgence(request.getUrgenceId()));
        if(request.getStatus()!= null && !request.getStatus().isEmpty()){
            existingTicket.setStatus(getTicketStatus(request.getStatus()));
            if(existingTicket.getStatus() == TicketStatus.FERME || existingTicket.getStatus() == TicketStatus.ANNULE || existingTicket.getStatus() == TicketStatus.RESOLU || existingTicket.getStatus() == TicketStatus.REJETE){
                existingTicket.setResolutionDate(LocalDate.now());
            }else{
                existingTicket.setResolutionDate(null);
            }
        }
            
        Ticket updatedTicket = ticketRepository.save(existingTicket);
        updatedTicket.setCreationDate(creationDate);
        return mapToResponse(updatedTicket);
    }

    @Transactional
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByUser(Long userId) {
        return ticketRepository.findByDemandeurId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MonthlyTicketStats> getMonthlyTicketStatistics(int year, Long assigneeId) {
        List<MonthlyTicketStats> monthlyStats = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.plusMonths(1).minusDays(1);

            LocalDate startOfDay = startDate;
            LocalDate endOfDay = endDate;

            long createdCount = ticketRepository.countByCreationDateBetween(startOfDay, endOfDay);
            long resolvedCount = ticketRepository.countByResolutionDateBetweenAndStatus(startOfDay, endOfDay, TicketStatus.RESOLU);
            long inProgressCount = ticketRepository.countByCreationDateBetweenAndStatusIn(startOfDay, endOfDay, List.of(TicketStatus.EN_ATTENTE, TicketStatus.ESCALADE));

            if (assigneeId != null) {
                createdCount = ticketRepository.countByCreationDateBetweenAndProprietaire_Id(startOfDay, endOfDay, assigneeId);
                resolvedCount = ticketRepository.countByResolutionDateBetweenAndStatusAndProprietaire_Id(startOfDay, endOfDay, TicketStatus.RESOLU, assigneeId);
                inProgressCount = ticketRepository.countByCreationDateBetweenAndStatusInAndProprietaire_Id(startOfDay, endOfDay, List.of(TicketStatus.EN_ATTENTE, TicketStatus.ESCALADE), assigneeId);
            }

            monthlyStats.add(new MonthlyTicketStats(month, (int) createdCount, (int) resolvedCount, (int) inProgressCount));
        }
        return monthlyStats;
    }
    
    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .objet(ticket.getObjet())
                .details(ticket.getDetails())
                .demandeur(ticket.getDemandeur() != null 
                    ? UserResponse.builder()
                        .id(ticket.getDemandeur().getId())
                        .username(ticket.getDemandeur().getUsername())
                        .firstname(ticket.getDemandeur().getFirstname())
                        .lastname(ticket.getDemandeur().getLastname())
                        .role(ticket.getDemandeur().getRole().name())
                        // ticketsDemandes et ticketsProprietes laissés null car non nécessaires ici
                        .build()
                    : null)
                .proprietaire(ticket.getProprietaire() != null 
                    ? UserResponse.builder()
                        .id(ticket.getProprietaire().getId())
                        .username(ticket.getProprietaire().getUsername())
                        .firstname(ticket.getProprietaire().getFirstname())
                        .lastname(ticket.getProprietaire().getLastname())
                        .role(ticket.getProprietaire().getRole().name())
                        .build()
                    : null)
                .site(ticket.getSite() != null 
                    ? SiteResponse.builder()
                        .id(ticket.getSite().getId())
                        .description(ticket.getSite().getDescription())
                        .build()
                    : null)
                .categorie(ticket.getCategorie() != null 
                    ? CategorieResponse.builder()
                        .id(ticket.getCategorie().getId())
                        .description(ticket.getCategorie().getDescription())
                        .build()
                    : null)
                .urgence(ticket.getUrgence() != null 
                    ? UrgenceResponse.builder()
                        .id(ticket.getUrgence().getId())
                        .description(ticket.getUrgence().getDescription())
                        .build()
                    : null)
                .status(ticket.getStatus() != null 
                ? new TicketStatusResponse(ticket.getStatus().name()) 
                : null)
                .creationDate(ticket.getCreationDate())
                
                .build();
    }
    private User getUser(Long userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    private Site getSite(Long siteId) {
        return siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found with id: " + siteId));
    }

    private Categorie getCategorie(Long categorieId) {
        return categorieRepository.findById(categorieId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categorieId));
    }

    private Urgence getUrgence(Long urgenceId) {
        return urgenceRepository.findById(urgenceId)
                .orElseThrow(() -> new RuntimeException("Urgency not found with id: " + urgenceId));
    }
    
    private TicketStatus getTicketStatus(String status) {
        try {
            return TicketStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide : " + status);
        }
    }
}