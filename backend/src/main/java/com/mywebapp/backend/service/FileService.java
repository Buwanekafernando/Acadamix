package com.mywebapp.backend.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mywebapp.backend.entity.FileEntity;
import com.mywebapp.backend.entity.User;
import com.mywebapp.backend.repository.FileRepository;

@Service
public class FileService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Autowired
    private LocalFileStorageService fileStorageService;

    @Autowired
    private FileRepository fileRepository;

    public FileEntity saveFileEntity(FileEntity fileEntity) {
        return fileRepository.save(fileEntity);
    }

    public Map<String, String> uploadFile(MultipartFile file, User user) throws Exception {
        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10MB");
        }

        // Validate file is not empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try {
            String fileLocation = fileStorageService.storeFile(file);
            String downloadUrl = "/api/files/download/" + fileLocation;

            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileLocation(fileLocation);
            fileEntity.setFileType(file.getContentType());
            fileEntity.setUser(user);

            fileRepository.save(fileEntity);

            Map<String, String> result = new HashMap<>();
            result.put("url", downloadUrl);
            result.put("file_location", fileLocation);
            result.put("file_name", file.getOriginalFilename());
            result.put("file_type", file.getContentType());
            return result;
        } catch (IOException e) {
            throw new Exception("Failed to upload file: " + e.getMessage());
        }
    }

    public List<FileEntity> listAllFilesByUser(User user) {
        if (user == null) {
            return fileRepository.findAll();
        }
        return fileRepository.findAllByUser(user);
    }

    public String getFileUrl(String fileLocation, User user) throws Exception {
        FileEntity fileEntity;
        if (user == null) {
            fileEntity = fileRepository.findByFileLocation(fileLocation);
        } else {
            fileEntity = fileRepository.findByFileLocationAndUser(fileLocation, user);
        }
        if (fileEntity == null) {
            throw new Exception("File not found or access denied");
        }
        return "/api/files/download/" + fileLocation;
    }

    public void deleteFile(String fileLocation, User user) throws Exception {
        FileEntity fileEntity;
        if (user == null) {
            fileEntity = fileRepository.findByFileLocation(fileLocation);
        } else {
            fileEntity = fileRepository.findByFileLocationAndUser(fileLocation, user);
        }
        if (fileEntity == null) {
            throw new Exception("File not found or access denied");
        }

        try {
            fileStorageService.deleteFile(fileLocation);
            fileRepository.delete(fileEntity);
        } catch (IOException e) {
            throw new Exception("Failed to delete file: " + e.getMessage());
        }
    }

    public Map<String, String> updateFile(String fileLocation, MultipartFile newFile, User user) throws Exception {
        FileEntity fileEntity;
        if (user == null) {
            fileEntity = fileRepository.findByFileLocation(fileLocation);
        } else {
            fileEntity = fileRepository.findByFileLocationAndUser(fileLocation, user);
        }
        if (fileEntity == null) {
            throw new Exception("File not found or access denied");
        }

        // Validate new file
        if (newFile.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("New file size exceeds the maximum limit of 10MB");
        }

        try {
            // Delete old file
            fileStorageService.deleteFile(fileLocation);

            // Store new file
            String newFileLocation = fileStorageService.storeFile(newFile);
            String downloadUrl = "/api/files/download/" + newFileLocation;

            fileEntity.setFileLocation(newFileLocation);
            fileEntity.setFileName(newFile.getOriginalFilename());
            fileEntity.setFileType(newFile.getContentType());
            fileRepository.save(fileEntity);

            Map<String, String> result = new HashMap<>();
            result.put("url", downloadUrl);
            result.put("file_location", newFileLocation);
            result.put("file_name", newFile.getOriginalFilename());
            result.put("file_type", newFile.getContentType());
            return result;
        } catch (IOException e) {
            throw new Exception("Failed to update file: " + e.getMessage());
        }
    }

    public FileEntity renameFile(String fileLocation, String newFileName, User user) throws Exception {
        FileEntity fileEntity;
        if (user == null) {
            fileEntity = fileRepository.findByFileLocation(fileLocation);
        } else {
            fileEntity = fileRepository.findByFileLocationAndUser(fileLocation, user);
        }
        if (fileEntity == null) {
            throw new Exception("File not found or access denied");
        }
        fileEntity.setFileName(newFileName);
        return fileRepository.save(fileEntity);
    }

    public FileEntity getFileEntity(String fileLocation, User user) {
        if (user == null) {
            return fileRepository.findByFileLocation(fileLocation);
        }
        return fileRepository.findByFileLocationAndUser(fileLocation, user);
    }
}

