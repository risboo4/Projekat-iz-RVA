package rs.raf.rafnovosti.requests;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class LoginRequest {

    @NotNull(message = "Email je obavezan")
    @NotEmpty(message = "Email ne sme biti prazan")
    private String email;

    @NotNull(message = "Lozinka je obavezna")
    @NotEmpty(message = "Lozinka ne sme biti prazna")
    private String password;
}
