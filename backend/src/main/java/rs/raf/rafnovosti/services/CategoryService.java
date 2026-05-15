package rs.raf.rafnovosti.services;

import rs.raf.rafnovosti.entities.Category;
import rs.raf.rafnovosti.repositories.category.CategoryRepository;

import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

public class CategoryService {

    @Inject
    CategoryRepository categoryRepository;

    public List<Category> findAll(int page, int pageSize) {
        return categoryRepository.findAll(page, pageSize);
    }

    public int count() {
        return categoryRepository.count();
    }

    public Category findById(int id) {
        Category category = categoryRepository.findById(id);
        if (category == null) {
            throw new WebApplicationException(
                Response.status(404).entity(Map.of("error", "Kategorija nije pronađena")).build()
            );
        }
        return category;
    }

    public Category insert(Category category) {
        if (categoryRepository.findByName(category.getName()) != null) {
            throw new WebApplicationException(
                Response.status(409).entity(Map.of("error", "Kategorija sa ovim imenom već postoji")).build()
            );
        }
        return categoryRepository.insert(category);
    }

    public Category update(int id, Category category) {
        if (categoryRepository.findById(id) == null) {
            throw new WebApplicationException(
                Response.status(404).entity(Map.of("error", "Kategorija nije pronađena")).build()
            );
        }
        Category existing = categoryRepository.findByName(category.getName());
        if (existing != null && existing.getId() != id) {
            throw new WebApplicationException(
                Response.status(409).entity(Map.of("error", "Kategorija sa ovim imenom već postoji")).build()
            );
        }
        return categoryRepository.update(id, category);
    }

    public void delete(int id) {
        if (categoryRepository.findById(id) == null) {
            throw new WebApplicationException(
                Response.status(404).entity(Map.of("error", "Kategorija nije pronađena")).build()
            );
        }
        if (categoryRepository.countArticles(id) > 0) {
            throw new WebApplicationException(
                Response.status(400).entity(Map.of("error", "Nije moguće obrisati kategoriju koja sadrži vesti")).build()
            );
        }
        categoryRepository.delete(id);
    }
}
