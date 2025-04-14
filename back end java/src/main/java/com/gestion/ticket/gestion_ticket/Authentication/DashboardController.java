// package com.gestion.ticket.gestion_ticket.Authentication;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.gestion.ticket.gestion_ticket.Model.User;
// import com.gestion.ticket.gestion_ticket.Repository.UserRepository;

// import lombok.RequiredArgsConstructor;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/dashboard")
// public class DashboardController {
// 	private final UserRepository userRepository;

//     @GetMapping
//     public ResponseEntity<?> getDashboardData() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         if (authentication != null && authentication.isAuthenticated()) {
//             String username = authentication.getName(); 
//             Map<String, Object> userData = new HashMap<>();
//             User user = userRepository.findByUsername(username).get();
//             userData.put("username", username);
//             userData.put("firstname", user.getFirstname()); // Exemple
//             userData.put("lastname", user.getLastname());   // Exemple
//             userData.put("roles", user.getRole()); 

//             return ResponseEntity.ok(userData);
//         } else {
//             return ResponseEntity.status(401).body("Non authentifié");
//         }
//     }
// }