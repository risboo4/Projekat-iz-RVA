package rs.raf.rafnovosti.repositories.tag;

import rs.raf.rafnovosti.entities.Tag;

public interface TagRepository {
    Tag findByName(String name);
    Tag insert(String name);
    void deleteArticleTags(int articleId);
    void insertArticleTag(int articleId, int tagId);
}
