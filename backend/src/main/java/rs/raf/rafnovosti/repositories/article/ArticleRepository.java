package rs.raf.rafnovosti.repositories.article;

import rs.raf.rafnovosti.entities.Article;

import java.util.List;

public interface ArticleRepository {
    List<Article> findAll(int page, int pageSize);
    List<Article> findByCategory(int categoryId, int page, int pageSize);
    List<Article> search(String query, int page, int pageSize);
    int countAll();
    int countByCategory(int categoryId);
    int countSearch(String query);
    Article findById(int id);
    String findAuthorEmail(int id);
    Article insert(Article article);
    Article update(int id, Article article);
    void delete(int id);
}
