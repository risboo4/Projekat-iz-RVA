package rs.raf.rafnovosti.entities;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class Category {

    private Integer id;

    @NotNull(message = "Ime kategorije je obavezno")
    @NotEmpty(message = "Ime kategorije ne sme biti prazno")
    private String name;

    @NotNull(message = "Opis je obavezan")
    @NotEmpty(message = "Opis ne sme biti prazan")
    private String description;

    public Category() {}

    public Category(Integer id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
