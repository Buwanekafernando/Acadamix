package com.mywebapp.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Integer postId;
    private String caption;
    private String mediaUrl;
    private String userName;
    private String userImage;
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean isLikedByCurrentUser;
    private List<CommentResponse> comments;
}
