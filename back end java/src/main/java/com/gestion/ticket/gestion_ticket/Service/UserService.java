package com.gestion.ticket.gestion_ticket.Service;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.gestion.ticket.gestion_ticket.Model.Role;
import com.gestion.ticket.gestion_ticket.Model.Ticket;
import com.gestion.ticket.gestion_ticket.Model.User;
import com.gestion.ticket.gestion_ticket.Repository.TicketRepository;
import com.gestion.ticket.gestion_ticket.Repository.UserRepository;
import com.gestion.ticket.gestion_ticket.Request.TicketFormat;
import com.gestion.ticket.gestion_ticket.Request.UserResponse;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketRepository ticketRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);


    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllDevelopers(){
        return userRepository.findByRole(Role.DEVELOPER);
    }
    
    public UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setRole(user.getRole().name());
        response.setTicketsDemandes(mapTicketsToSummary(user.getTicketsDemandes()));
        response.setTicketsProprietes(mapTicketsToSummary(user.getTicketsProprietes()));
        return response;
    }

    // Autre version utilisant le builder
    public UserResponse mapToUserRespon(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .firstname(user.getFirstname())
            .lastname(user.getLastname())
            .role(user.getRole().name())
            .build();
    }
    
    private List<TicketFormat> mapTicketsToSummary(List<Ticket> tickets) {
        return tickets.stream()
            .map(t -> new TicketFormat(t.getId(), t.getObjet(), t.getCreationDate()))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id){
        return userRepository.findById(id).get();
    }

    @Transactional
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }


    @Transactional
    public String updateUser(Long id, User userDetails) {
        logger.info("Updating user with ID: {}", id);
        logger.info("Provided password: {}", userDetails.getPassword()); // Add this line
        System.out.print(userDetails.getPassword());
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID : " + id));

        existingUser.setFirstname(userDetails.getFirstname());
        existingUser.setLastname(userDetails.getLastname());
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setRole(userDetails.getRole());

        // Vérifier si un nouveau mot de passe est fourni
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            // existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            existingUser.setPassword(BCrypt.hashpw(userDetails.getPassword(), BCrypt.gensalt()));
            logger.info("Password updated for user ID: {}", id); // Add this line
        } else {
            logger.info("No new password provided for user ID: {}", id); // Add this line
        }

        // if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
        //         existingUser.setPassword(BCrypt.hashpw(userDetails.getPassword(), BCrypt.gensalt()));
        // }

        userRepository.save(existingUser);
        return "Informations de l'utilisateur mises à jour avec succès";
    }

    @Transactional
    public String deleteUser(Long id) {
        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID : " + id));

        // Dissocier l'utilisateur des tickets en tant que demandeur
        List<Ticket> demandes = ticketRepository.findByDemandeurId(userToDelete.getId());
        for (Ticket ticket : demandes) {
            ticket.setDemandeur(null);
            ticketRepository.save(ticket);
        }

        // Dissocier l'utilisateur des tickets en tant que propriétaire
        List<Ticket> proprietes = ticketRepository.findByProprietaireId(userToDelete.getId());
        for (Ticket ticket : proprietes) {
            ticket.setProprietaire(null);
            ticketRepository.save(ticket);
        }

        userRepository.delete(userToDelete);
        return "Supprimer avec succes";
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
