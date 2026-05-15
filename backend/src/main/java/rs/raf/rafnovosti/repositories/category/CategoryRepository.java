package rs.raf.rafnovosti.repositories.category;

import rs.raf.rafnovosti.entities.Category;

import java.util.List;

public interface CategoryRepository {
    List<Category> findAll(int page, int pageSize);
    int count();
    Category findById(int id);
    Category findByName(String name);
    int countArticles(int categoryId);
    Category insert(Category category);
    Category update(int id, Category category);
    void delete(int id);
}
