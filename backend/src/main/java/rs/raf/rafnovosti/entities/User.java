package rs.raf.rafnovosti.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
public class User {

    @NotNull(message = "Email je obavezan")
    @NotEmpty(message = "Email ne sme biti prazan")
    private String email;

    @NotNull(message = "Ime je obavezno")
    @NotEmpty(message = "Ime ne sme biti prazno")
    private String firstName;

    @NotNull(message = "Prezime je obavezno")
    @NotEmpty(message = "Prezime ne sme biti prazno")
    private String lastName;

    @NotNull(message = "Tip je obavezan")
    @NotEmpty(message = "Tip ne sme biti prazan")
    private String type;

    private String status;
    private String hashedPassword;
    private String password;

    public User(String email, String firstName, String lastName, String type, String status, String hashedPassword) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
        this.status = status;
        this.hashedPassword = hashedPassword;
    }

    @JsonIgnore
    public String getHashedPassword() { return hashedPassword; }

    @JsonProperty
    public void setHashedPassword(String hashedPassword) { this.hashedPassword = hashedPassword; }
}
