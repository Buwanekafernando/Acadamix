package com.mywebapp.backend.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.mywebapp.backend.entity.FileEntity;
import com.mywebapp.backend.service.FileService;
import com.mywebapp.backend.service.LocalFileStorageService;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", maxAge = 3600)
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private LocalFileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please select a file to upload"));
            }

            Map<String, String> result = fileService.uploadFile(file, null);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Add this for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam("file_location") String fileLocation) {
        try {
            fileService.deleteFile(fileLocation, null);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "File deleted successfully",
                "file_location", fileLocation
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
                ));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listFiles() {
        try {
            List<FileEntity> files = fileService.listAllFilesByUser(null);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to list files: " + e.getMessage()));
        }
    }

    @GetMapping("/download/{fileLocation}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileLocation) {
        try {
            // Verify file exists
            FileEntity fileEntity = fileService.getFileEntity(fileLocation, null);
            if (fileEntity == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "File not found"));
            }

            Path filePath = fileStorageService.getFilePath(fileLocation);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileEntity.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getFileName() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "File not found"));
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to download file: " + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateFile(
            @RequestParam("file_location") String fileLocation,
            @RequestParam("file") MultipartFile newFile) {
        try {
            Map<String, String> result = fileService.updateFile(fileLocation, newFile, null);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Update failed: " + e.getMessage()));
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<?> renameFile(
            @RequestParam("file_location") String fileLocation,
            @RequestParam("new_file_name") String newFileName) {
        try {
            FileEntity updatedFile = fileService.renameFile(fileLocation, newFileName, null);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "File renamed successfully",
                "file_location", updatedFile.getFileLocation(),
                "new_file_name", updatedFile.getFileName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Rename failed: " + e.getMessage()));
        }
    }
}


