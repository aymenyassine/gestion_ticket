package com.gestion.ticket.gestion_ticket.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestion.ticket.gestion_ticket.Model.Role;
import com.gestion.ticket.gestion_ticket.Model.User;


public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByUsername(String email);
    Optional<String> findDescriptionById(Long id);
    List<User> findByRole(Role role);
}   