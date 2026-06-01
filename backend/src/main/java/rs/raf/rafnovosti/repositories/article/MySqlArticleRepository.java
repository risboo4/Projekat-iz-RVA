package rs.raf.rafnovosti.repositories.article;

import rs.raf.rafnovosti.entities.Article;
import rs.raf.rafnovosti.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MySqlArticleRepository extends MySqlAbstractRepository implements ArticleRepository {

    private static final String BASE_SELECT =
        "SELECT a.id, a.title, a.content, a.published_at, a.author_email, a.category_id, " +
        "u.first_name AS author_first_name, u.last_name AS author_last_name, " +
        "c.name AS category_name " +
        "FROM articles a " +
        "JOIN users u ON a.author_email = u.email " +
        "JOIN categories c ON a.category_id = c.id ";

    @Override
    public List<Article> findAll(int page, int pageSize) {
        List<Article> list = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                BASE_SELECT + "ORDER BY a.published_at DESC LIMIT ? OFFSET ?"
            );
            ps.setInt(1, pageSize);
            ps.setInt(2, (page - 1) * pageSize);
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
    public List<Article> findByCategory(int categoryId, int page, int pageSize) {
        List<Article> list = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                BASE_SELECT + "WHERE a.category_id = ? ORDER BY a.published_at DESC LIMIT ? OFFSET ?"
            );
            ps.setInt(1, categoryId);
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
    public List<Article> search(String query, int page, int pageSize) {
        List<Article> list = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            String like = "%" + query + "%";
            ps = connection.prepareStatement(
                BASE_SELECT + "WHERE a.title LIKE ? OR a.content LIKE ? ORDER BY a.published_at DESC LIMIT ? OFFSET ?"
            );
            ps.setString(1, like);
            ps.setString(2, like);
            ps.setInt(3, pageSize);
            ps.setInt(4, (page - 1) * pageSize);
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
    public int countAll() {
        Connection connection = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            st = connection.createStatement();
            rs = st.executeQuery("SELECT COUNT(*) FROM articles");
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(st); closeConnection(connection);
        }
        return 0;
    }

    @Override
    public int countByCategory(int categoryId) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("SELECT COUNT(*) FROM articles WHERE category_id = ?");
            ps.setInt(1, categoryId);
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
    public int countSearch(String query) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            String like = "%" + query + "%";
            ps = connection.prepareStatement("SELECT COUNT(*) FROM articles WHERE title LIKE ? OR content LIKE ?");
            ps.setString(1, like);
            ps.setString(2, like);
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
    public Article findById(int id) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(BASE_SELECT + "WHERE a.id = ?");
            ps.setInt(1, id);
            rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return null;
    }

    @Override
    public String findAuthorEmail(int id) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("SELECT author_email FROM articles WHERE id = ?");
            ps.setInt(1, id);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getString("author_email");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return null;
    }

    @Override
    public Article insert(Article article) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "INSERT INTO articles (title, content, author_email, category_id) VALUES (?, ?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, article.getTitle());
            ps.setString(2, article.getContent());
            ps.setString(3, article.getAuthorEmail());
            ps.setInt(4, article.getCategoryId());
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) article.setId(rs.getInt(1));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return article;
    }

    @Override
    public Article update(int id, Article article) {
        Connection connection = null;
        PreparedStatement ps = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "UPDATE articles SET title = ?, content = ?, category_id = ? WHERE id = ?"
            );
            ps.setString(1, article.getTitle());
            ps.setString(2, article.getContent());
            ps.setInt(3, article.getCategoryId());
            ps.setInt(4, id);
            ps.executeUpdate();
            article.setId(id);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeStatement(ps); closeConnection(connection);
        }
        return article;
    }

    @Override
    public void delete(int id) {
        Connection connection = null;
        try {
            connection = newConnection();
            connection.setAutoCommit(false);

            try (PreparedStatement ps = connection.prepareStatement("DELETE FROM comments WHERE article_id = ?")) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }
            try (PreparedStatement ps = connection.prepareStatement("DELETE FROM articles WHERE id = ?")) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }

            connection.commit();
        } catch (SQLException e) {
            try { if (connection != null) connection.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            e.printStackTrace();
        } finally {
            closeConnection(connection);
        }
    }

    @Override
    public List<Article> findLatest() {
        List<Article> list = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(BASE_SELECT + "ORDER BY a.published_at DESC LIMIT 10");
            rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs); closeStatement(ps); closeConnection(connection);
        }
        return list;
    }

    private Article mapRow(ResultSet rs) throws SQLException {
        Article a = new Article();
        a.setId(rs.getInt("id"));
        a.setTitle(rs.getString("title"));
        a.setContent(rs.getString("content"));
        a.setPublishedAt(rs.getString("published_at"));
        a.setAuthorEmail(rs.getString("author_email"));
        a.setCategoryId(rs.getInt("category_id"));
        a.setAuthorFirstName(rs.getString("author_first_name"));
        a.setAuthorLastName(rs.getString("author_last_name"));
        a.setCategoryName(rs.getString("category_name"));
        return a;
    }
}
