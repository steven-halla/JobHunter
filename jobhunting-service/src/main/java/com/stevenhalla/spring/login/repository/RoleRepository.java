package com.stevenhalla.spring.login.repository;

import com.stevenhalla.spring.login.models.ERole;
import com.stevenhalla.spring.login.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
