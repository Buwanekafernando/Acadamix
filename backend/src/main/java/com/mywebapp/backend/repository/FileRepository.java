package com.mywebapp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mywebapp.backend.entity.FileEntity;
import com.mywebapp.backend.entity.User;

public interface FileRepository extends JpaRepository<FileEntity, Long> { 
    FileEntity findByFileLocation(String fileLocation); 

    List<FileEntity> findAllByUser(User user);

    FileEntity findByFileLocationAndUser(String fileLocation, User user);
}
