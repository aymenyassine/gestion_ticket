package com.gestion.ticket.gestion_ticket.Authentication;

import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RequiredArgsConstructor
@Controller
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService service;
    
    

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticated(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticated(request));  
    }

    
 
} 