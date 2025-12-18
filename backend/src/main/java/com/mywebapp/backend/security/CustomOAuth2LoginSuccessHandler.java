package com.mywebapp.backend.security;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.mywebapp.backend.entity.User;
import com.mywebapp.backend.repository.UserRepository;
import com.mywebapp.backend.security.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final OAuth2AuthorizedClientService clientService;
    private final JwtUtil jwtUtil;

    public CustomOAuth2LoginSuccessHandler(UserRepository userRepository, 
            OAuth2AuthorizedClientService clientService,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.clientService = clientService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                      HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            // Get OAuth2 client for token refresh
            OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                oauthToken.getName()
            );

            String email = (String) attributes.get("email");
            if (email == null) {
                throw new RuntimeException("Email not found in OAuth2 attributes");
            }

            final String name = (String) attributes.get("name") != null ? 
                (String) attributes.get("name") : 
                email.split("@")[0]; 

            String picture = (String) attributes.get("picture");
            String googleId = (String) attributes.get("sub");
            if (googleId == null) {
                throw new RuntimeException("Google ID not found in OAuth2 attributes");
            }

            // Create or update user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setProfileImage(picture);
                newUser.setGoogleId(googleId);
                newUser.setCreatedAt(LocalDateTime.now());
                
               
                final String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
                // Ensure username is unique 
                String username = baseUsername;
                int counter = 1;
                while (userRepository.findByUsername(username).isPresent()) {
                    username = baseUsername + counter++;
                }
                newUser.setUsername(username);

                if (client.getRefreshToken() != null) {
                    newUser.setOauthRefreshToken(client.getRefreshToken().getTokenValue());
                }
                return userRepository.save(newUser);
            });

            // Update refresh token 
            if (client.getRefreshToken() != null) {
                user.setOauthRefreshToken(client.getRefreshToken().getTokenValue());
                userRepository.save(user);
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            
            response.setHeader("Authorization", "Bearer " + token);

          
            String redirectUrl = String.format(
                "http://localhost:3000/oauth2/redirect?token=%s",
                token
            );

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
} 