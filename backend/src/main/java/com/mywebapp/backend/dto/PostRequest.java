package com.mywebapp.backend.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String caption;
    private String mediaUrl;
}
