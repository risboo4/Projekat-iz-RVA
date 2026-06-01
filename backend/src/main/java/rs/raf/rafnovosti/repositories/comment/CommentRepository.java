package rs.raf.rafnovosti.repositories.comment;

import rs.raf.rafnovosti.entities.Comment;

import java.util.List;

public interface CommentRepository {
    List<Comment> findByArticleId(int articleId, int page, int pageSize);
    int countByArticleId(int articleId);
    Comment insert(int articleId, String authorName, String content);
}
