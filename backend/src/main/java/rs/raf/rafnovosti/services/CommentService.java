package rs.raf.rafnovosti.services;

import rs.raf.rafnovosti.entities.Comment;
import rs.raf.rafnovosti.repositories.comment.CommentRepository;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CommentService {

    @Inject
    CommentRepository commentRepository;

    public Map<String, Object> findByArticleId(int articleId, int page, int pageSize) {
        List<Comment> data = commentRepository.findByArticleId(articleId, page, pageSize);
        int total = commentRepository.countByArticleId(articleId);
        Map<String, Object> result = new HashMap<>();
        result.put("data", data);
        result.put("totalCount", total);
        return result;
    }

    public Comment insert(int articleId, String authorName, String content) {
        return commentRepository.insert(articleId, authorName.trim(), content.trim());
    }
}
