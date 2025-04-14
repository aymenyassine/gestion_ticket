package com.gestion.ticket.gestion_ticket.Controller;





import org.springframework.http.ResponseEntity;

import java.util.stream.Collectors;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import com.gestion.ticket.gestion_ticket.Model.Role;
import com.gestion.ticket.gestion_ticket.Model.TicketStatus;
import com.gestion.ticket.gestion_ticket.Model.User;
import com.gestion.ticket.gestion_ticket.Repository.CategorieRepository;
import com.gestion.ticket.gestion_ticket.Repository.SiteRepository;
import com.gestion.ticket.gestion_ticket.Repository.UrgenceRepository;
import com.gestion.ticket.gestion_ticket.Repository.UserRepository;
import com.gestion.ticket.gestion_ticket.Request.CategorieResponse;
import com.gestion.ticket.gestion_ticket.Request.SiteResponse;
import com.gestion.ticket.gestion_ticket.Request.TicketRequest;
import com.gestion.ticket.gestion_ticket.Request.TicketResponse;
import com.gestion.ticket.gestion_ticket.Request.UrgenceResponse;
import com.gestion.ticket.gestion_ticket.Request.UserResponse;
import com.gestion.ticket.gestion_ticket.Service.TicketService;
import com.gestion.ticket.gestion_ticket.Service.UserService;

import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;
    private final SiteRepository siteRepository;
    private final UrgenceRepository urgenceRepository;
    private final CategorieRepository categorieRepository;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Validated @RequestBody TicketRequest request) {
        TicketResponse createdTicket = ticketService.createTicket(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdTicket.getId())
                .toUri();
        return ResponseEntity.created(location).body(createdTicket);
    }
    // @PostMapping("/ajouter")
    // public TicketResponse creationTicket(@RequestBody TicketRequest tiket){
    //     return ticketService.createTicket(tiket);    
    // }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // Utility endpoints for form data
    @GetMapping("/metadata")
    public ResponseEntity<MetadataResponse> getTicketMetadata() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<UserResponse> demandeurs = userRepository.findByRole(Role.EMPLOYE).stream()
            .map(userService::mapToUserResponse)
            .collect(Collectors.toList());

        demandeurs.addAll(
            userRepository.findByRole(Role.ADMIN).stream()
                .map(userService::mapToUserResponse)
                .collect(Collectors.toList())
        );
        demandeurs.addAll(
            userRepository.findByRole(Role.DEVELOPER).stream()
                .map(userService::mapToUserResponse)
                .collect(Collectors.toList())
        );

        List<UserResponse> recepteurs = userRepository.findByRole(Role.DEVELOPER).stream()
            .map(userService::mapToUserResponse)
            .collect(Collectors.toList());

        List<SiteResponse> sites = siteRepository.findAll().stream()
            .map(site -> new SiteResponse(site.getId(), site.getDescription()))
            .collect(Collectors.toList());

        List<CategorieResponse> categories = categorieRepository.findAll().stream()
            .map(cat -> new CategorieResponse(cat.getId(), cat.getDescription()))
            .collect(Collectors.toList());

        List<UrgenceResponse> urgences = urgenceRepository.findAll().stream()
            .map(urgence -> new UrgenceResponse(urgence.getId(), urgence.getDescription()))
            .collect(Collectors.toList());
        
        List<String> statuses = Arrays.stream(TicketStatus.values())
                .map(Enum::name)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new MetadataResponse(
            demandeurs,
            recepteurs,
            sites,
            categories,
            urgences,
            user.getFullName(),
            user.getRole().name(),
            statuses 
        ));
    }


    // Définition du record pour la réponse
    public record MetadataResponse(
    	    List<UserResponse> demandeurs,
    	    List<UserResponse> recepteurs,
    	    List<SiteResponse> sites,
    	    List<CategorieResponse> categories,
    	    List<UrgenceResponse> urgences,
    	    String currentUser,
    	    String userRole,
    	    List<String> statuses
    	    
    	) {}



    

}