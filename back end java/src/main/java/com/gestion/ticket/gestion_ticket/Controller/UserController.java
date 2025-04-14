package com.gestion.ticket.gestion_ticket.Controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.security.core.Authentication;
import com.gestion.ticket.gestion_ticket.Authentication.AuthenticationResponse;
import com.gestion.ticket.gestion_ticket.Authentication.AuthenticationService;
import com.gestion.ticket.gestion_ticket.Authentication.RegisterRequest;
import com.gestion.ticket.gestion_ticket.Model.User;
import com.gestion.ticket.gestion_ticket.Repository.UserRepository;
import com.gestion.ticket.gestion_ticket.Request.UserMeResponse;
import com.gestion.ticket.gestion_ticket.Request.UserResponse;
import com.gestion.ticket.gestion_ticket.Service.UserService;


import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final AuthenticationService service;
    
    @PostMapping("/create")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        
        return ResponseEntity.ok(service.register(request));
    }
    
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers()
            .stream()
            .map(userService::mapToUserResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    // UserController.java
    @GetMapping("/developers")
    public ResponseEntity<List<UserResponse>> getAllDevelopers() {
        List<UserResponse> developers = userService.getAllDevelopers()
            .stream()
            .map(userService::mapToUserResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(developers);
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();
        return ResponseEntity.created(location).body(createdUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userService.mapToUserResponse(user));


    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails) {
    	System.out.print(userDetails.getPassword());
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

//    @DeleteMapping("/users/{id}")
//    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
//        try {
//            userService.deleteUser(id);
//            return ResponseEntity.ok("Utilisateur supprimé avec succès");
//        } catch (EntityNotFoundException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la suppression de l'utilisateur");
//        }
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
       return ResponseEntity.ok(userService.deleteUser(id));
    }

    

    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> getCurrentUser(Authentication authentication) {
        // Vérification de l'authentification
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Récupération de l'utilisateur depuis la base de données
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

        // Construction de la réponse
        UserMeResponse response = new UserMeResponse();
        response.setUserRole(user.getRole().name());
        response.setUserId(user.getId());
        response.setCurrentUser(user.getFullName());

        return ResponseEntity.ok(response);
    }

}