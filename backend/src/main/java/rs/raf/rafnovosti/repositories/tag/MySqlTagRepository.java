package rs.raf.rafnovosti.repositories.tag;

import rs.raf.rafnovosti.entities.Tag;
import rs.raf.rafnovosti.repositories.MySqlAbstractRepository;

import java.sql.*;

public class MySqlTagRepository extends MySqlAbstractRepository implements TagRepository {

    @Override
    public Tag findByName(String name) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("SELECT * FROM tags WHERE name = ?");
            ps.setString(1, name);
            rs = ps.executeQuery();
            if (rs.next()) return new Tag(rs.getInt("id"), rs.getString("name"));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return null;
    }

    @Override
    public Tag insert(String name) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        Tag tag = new Tag();
        try {
            connection = newConnection();
            ps = connection.prepareStatement("INSERT INTO tags (name) VALUES (?)", Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                tag.setId(rs.getInt(1));
                tag.setName(name);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return tag;
    }

    @Override
    public void deleteArticleTags(int articleId) {
        Connection connection = null;
        PreparedStatement ps = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("DELETE FROM article_tags WHERE article_id = ?");
            ps.setInt(1, articleId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeStatement(ps); closeConnection(connection);
        }
    }

    @Override
    public void insertArticleTag(int articleId, int tagId) {
        Connection connection = null;
        PreparedStatement ps = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)");
            ps.setInt(1, articleId);
            ps.setInt(2, tagId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeStatement(ps); closeConnection(connection);
        }
    }
}
