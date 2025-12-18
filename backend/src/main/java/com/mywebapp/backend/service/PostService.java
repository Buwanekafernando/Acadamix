package com.mywebapp.backend.service;

import com.mywebapp.backend.dto.CommentResponse;
import com.mywebapp.backend.dto.PostRequest;
import com.mywebapp.backend.dto.PostResponse;
import com.mywebapp.backend.entity.*;
import com.mywebapp.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public Post createPost(User user, PostRequest request) {
        Post post = new Post();
        post.setUser(user);
        post.setCaption(request.getCaption());
        post.setMediaUrl(request.getMediaUrl());
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts(User currentUser) {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream().map(post -> mapToResponse(post, currentUser)).collect(Collectors.toList());
    }

    private PostResponse mapToResponse(Post post, User currentUser) {
        PostResponse response = new PostResponse();
        response.setPostId(post.getPostId());
        response.setCaption(post.getCaption());
        response.setMediaUrl(post.getMediaUrl());
        response.setCreatedAt(post.getCreatedAt());
        response.setUserName(post.getUser().getUsername()); // Assuming User has getUsername
        response.setUserImage(post.getUser().getProfileImage()); // Assuming User has getProfileImage

        response.setLikeCount(postLikeRepository.countByPost(post));
        if (currentUser != null) {
            response.setLikedByCurrentUser(postLikeRepository.existsByPostAndUser(post, currentUser));
        }

        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtAsc(post);
        response.setComments(comments.stream().map(this::mapCommentToResponse).collect(Collectors.toList()));

        return response;
    }

    private CommentResponse mapCommentToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setText(comment.getText());
        response.setUserName(comment.getUser().getUsername());
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }

    @Transactional
    public void toggleLike(Integer postId, User user) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (postLikeRepository.existsByPostAndUser(post, user)) {
            PostLike like = postLikeRepository.findByPostAndUser(post, user).orElseThrow();
            postLikeRepository.delete(like);
        } else {
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);

            // Create Notification if not self-like
            if (!post.getUser().getId().equals(user.getId())) {
                createNotification(post.getUser(), user.getUsername() + " liked your post", "LIKE");
            }
        }
    }

    @Transactional
    public Comment addComment(Integer postId, User user, String text) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // Create Notification
        if (!post.getUser().getId().equals(user.getId())) {
            createNotification(post.getUser(), user.getUsername() + " commented on your post", "COMMENT");
        }
        return savedComment;
    }

    private void createNotification(User recipient, String message, String type) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}
