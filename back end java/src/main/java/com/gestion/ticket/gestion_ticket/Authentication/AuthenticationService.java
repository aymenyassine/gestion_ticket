package com.gestion.ticket.gestion_ticket.Authentication;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestion.ticket.gestion_ticket.Configuration.JwtService;
import com.gestion.ticket.gestion_ticket.Model.User;
import com.gestion.ticket.gestion_ticket.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole()).build();

            userRepository.save(user);
            var jwtToken = jwtService.generateToken(user);

            return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }

    public AuthenticationResponse authenticated(AuthenticationRequest request){
        System.out.println("Username: " + request.getUsername());
        System.out.println("Password: " + request.getPassword());
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword())
        );
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        System.out.println("JWT Token Generated: " + jwtToken);
            return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }

    // public AuthenticationResponse authenticated(String username, String password) {
    //     authenticationManager.authenticate(
    //         new UsernamePasswordAuthenticationToken(username, password)
    //     );
        
    //     User user = userRepository.findByUsername(username)
    //         .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        
    //     String jwtToken = jwtService.generateToken(user);
        
    //     return AuthenticationResponse.builder()
    //         .token(jwtToken)
    //         .build();
    // }
}
