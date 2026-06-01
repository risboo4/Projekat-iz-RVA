package rs.raf.rafnovosti.services;

import rs.raf.rafnovosti.entities.Article;
import rs.raf.rafnovosti.repositories.article.ArticleRepository;

import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ArticleService {

    @Inject ArticleRepository articleRepository;
    @Inject UserService userService;

    public Map<String, Object> findAll(int page, int pageSize) {
        Map<String, Object> result = new HashMap<>();
        result.put("data", articleRepository.findAll(page, pageSize));
        result.put("totalCount", articleRepository.countAll());
        return result;
    }

    public Map<String, Object> findByCategory(int categoryId, int page, int pageSize) {
        Map<String, Object> result = new HashMap<>();
        result.put("data", articleRepository.findByCategory(categoryId, page, pageSize));
        result.put("totalCount", articleRepository.countByCategory(categoryId));
        return result;
    }

    public Map<String, Object> search(String query, int page, int pageSize) {
        Map<String, Object> result = new HashMap<>();
        result.put("data", articleRepository.search(query, page, pageSize));
        result.put("totalCount", articleRepository.countSearch(query));
        return result;
    }

    public Article findById(int id) {
        Article article = articleRepository.findById(id);
        if (article == null) {
            throw new WebApplicationException(
                Response.status(404).entity(Map.of("error", "Vest nije pronađena")).build()
            );
        }
        return article;
    }

    public Article insert(Article article) {
        Article saved = articleRepository.insert(article);
        return articleRepository.findById(saved.getId());
    }

    public Article update(int id, Article article, String token) {
        checkPermission(id, token);
        articleRepository.update(id, article);
        return articleRepository.findById(id);
    }

    public void delete(int id, String token) {
        checkPermission(id, token);
        articleRepository.delete(id);
    }

    public List<Article> findLatest() {
        return articleRepository.findLatest();
    }

    private void checkPermission(int articleId, String token) {
        String role = userService.getRole(token);
        if ("ADMIN".equals(role)) return;

        String authorEmail = articleRepository.findAuthorEmail(articleId);
        String currentEmail = userService.getEmailFromToken(token);
        if (!currentEmail.equals(authorEmail)) {
            throw new WebApplicationException(
                Response.status(403).entity(Map.of("error", "Nemate dozvolu za ovu akciju")).build()
            );
        }
    }
}
