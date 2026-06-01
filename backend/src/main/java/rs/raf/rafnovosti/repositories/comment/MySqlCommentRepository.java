package rs.raf.rafnovosti.repositories.comment;

import rs.raf.rafnovosti.entities.Comment;
import rs.raf.rafnovosti.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MySqlCommentRepository extends MySqlAbstractRepository implements CommentRepository {

    @Override
    public List<Comment> findByArticleId(int articleId, int page, int pageSize) {
        List<Comment> list = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "SELECT id, author_name, content, created_at, article_id FROM comments " +
                "WHERE article_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            ps.setInt(1, articleId);
            ps.setInt(2, pageSize);
            ps.setInt(3, (page - 1) * pageSize);
            rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return list;
    }

    @Override
    public int countByArticleId(int articleId) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("SELECT COUNT(*) FROM comments WHERE article_id = ?");
            ps.setInt(1, articleId);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return 0;
    }

    @Override
    public Comment insert(int articleId, String authorName, String content) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        Comment comment = new Comment();
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "INSERT INTO comments (article_id, author_name, content) VALUES (?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setInt(1, articleId);
            ps.setString(2, authorName);
            ps.setString(3, content);
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) comment.setId(rs.getInt(1));
            comment.setArticleId(articleId);
            comment.setAuthorName(authorName);
            comment.setContent(content);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return comment;
    }

    private Comment mapRow(ResultSet rs) throws SQLException {
        Comment c = new Comment();
        c.setId(rs.getInt("id"));
        c.setAuthorName(rs.getString("author_name"));
        c.setContent(rs.getString("content"));
        c.setCreatedAt(rs.getString("created_at"));
        c.setArticleId(rs.getInt("article_id"));
        return c;
    }
}
