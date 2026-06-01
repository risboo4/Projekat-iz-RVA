package rs.raf.rafnovosti.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    private Integer id;

    @NotNull(message = "Ime kategorije je obavezno")
    @NotEmpty(message = "Ime kategorije ne sme biti prazno")
    private String name;

    @NotNull(message = "Opis je obavezan")
    @NotEmpty(message = "Opis ne sme biti prazan")
    private String description;
}
