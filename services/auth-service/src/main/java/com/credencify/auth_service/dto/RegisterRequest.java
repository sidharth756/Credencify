package com.credencify.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank(message = "Name Should be not empty")
    private String fullName;
    @Email(message = "Enter Valid email address")
    @NotNull(message ="Email should be not emopty")
    private String email;
    @Size(min = 6,message = "Password must be atleast 6 characters")
    private String password;

}
