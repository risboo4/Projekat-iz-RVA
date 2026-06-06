package rs.raf.rafnovosti.entities;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Data
public class Article {

    private Integer id;

    @NotNull(message = "Naslov je obavezan")
    @NotEmpty(message = "Naslov ne sme biti prazan")
    private String title;

    @NotNull(message = "Sadržaj je obavezan")
    @NotEmpty(message = "Sadržaj ne sme biti prazan")
    private String content;

    private String publishedAt;
    private String authorEmail;

    @NotNull(message = "Kategorija je obavezna")
    private Integer categoryId;

    private String authorFirstName;
    private String authorLastName;
    private String categoryName;

    private List<String> tags = new ArrayList<>();
}
