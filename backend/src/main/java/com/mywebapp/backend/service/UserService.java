package com.mywebapp.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mywebapp.backend.entity.User;
import com.mywebapp.backend.repository.UserRepository;
import com.mywebapp.backend.service.FileService;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User createUser(String name, String email) throws Exception {
        if (existsByEmail(email)) {
            throw new Exception("Email already in use");
        }
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public User createOrUpdateGoogleUser(String googleId, String email, String name, String profileImage, String refreshToken) {
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(name);
            user.setProfileImage(profileImage);
            user.setOauthRefreshToken(refreshToken);
            return userRepository.save(user);
        }

        // Check if user exists with email but no Google ID
        Optional<User> existingEmailUser = userRepository.findByEmail(email);
        if (existingEmailUser.isPresent()) {
            User user = existingEmailUser.get();
            user.setGoogleId(googleId);
            user.setName(name);
            user.setProfileImage(profileImage);
            user.setOauthRefreshToken(refreshToken);
            return userRepository.save(user);
        }

        // Create new user
        User newUser = new User();
        newUser.setGoogleId(googleId);
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setProfileImage(profileImage);
        newUser.setOauthRefreshToken(refreshToken);
        newUser.setCreatedAt(LocalDateTime.now());
        
        return userRepository.save(newUser);
    }


    public User updateUser(Long userId, String name, String githubUrl, String instagramUrl, String linkedinUrl) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        
        User user = userOpt.get();
        if (name != null) user.setName(name);
        if (githubUrl != null) user.setGithubUrl(githubUrl);
        if (instagramUrl != null) user.setInstagramUrl(instagramUrl);
        if (linkedinUrl != null) user.setLinkedinUrl(linkedinUrl);
        
        return userRepository.save(user);
    }

    public User updateProfileImage(Long userId, MultipartFile imageFile) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        
        User user = userOpt.get();
        
        // Delete old profile image if exists
        if (user.getProfileImage() != null) {
            fileService.deleteFile(user.getProfileImage(), user);
        }
        
        // Upload the new image file
        Map<String, String> uploadResult = fileService.uploadFile(imageFile, user);
        String imagePath = uploadResult.get("url");
        
        // Update user's profile image path
        user.setProfileImage(imagePath);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        
        User user = userOpt.get();
        
        // Delete profile image if exists
        if (user.getProfileImage() != null) {
            fileService.deleteFile(user.getProfileImage(), user);
        }
        
        userRepository.delete(user);
    }

    public void followUser(Long userId, Long followingId) throws Exception {
        // TODO: Implement follow logic using user_following table
        // For now, just print
        System.out.println("User " + userId + " followed user " + followingId);
    }

    public void unfollowUser(Long userId, Long followingId) throws Exception {
        // TODO: Implement unfollow logic using user_following table
        System.out.println("User " + userId + " unfollowed user " + followingId);
    }

    // Search users by username or name
    public java.util.List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    }
}
