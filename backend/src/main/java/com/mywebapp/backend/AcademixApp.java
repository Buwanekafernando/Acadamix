package com.mywebapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class AcademixApp {

	public static void main(String[] args) {
		SpringApplication.run(AcademixApp.class, args);
		System.out.println("Server started! Try http://localhost:8080");
	}
	

}
