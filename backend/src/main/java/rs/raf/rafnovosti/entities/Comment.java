package rs.raf.rafnovosti.entities;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class Comment {

    private Integer id;

    @NotNull(message = "Ime autora je obavezno")
    @NotEmpty(message = "Ime autora ne sme biti prazno")
    private String authorName;

    @NotNull(message = "Sadržaj komentara je obavezan")
    @NotEmpty(message = "Sadržaj komentara ne sme biti prazan")
    private String content;

    private String createdAt;
    private Integer articleId;
}
