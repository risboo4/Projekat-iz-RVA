package rs.raf.rafnovosti.repositories.user;

import rs.raf.rafnovosti.entities.User;
import rs.raf.rafnovosti.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MySqlUserRepository extends MySqlAbstractRepository implements UserRepository {

    @Override
    public User findByEmail(String email) {
        User user = null;
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("SELECT * FROM users WHERE email = ?");
            ps.setString(1, email);
            rs = ps.executeQuery();
            if (rs.next()) {
                user = mapRow(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs);
            closeStatement(ps);
            closeConnection(connection);
        }
        return user;
    }

    @Override
    public List<User> findAll(int page, int pageSize) {
        List<User> users = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement("SELECT * FROM users LIMIT ? OFFSET ?");
            ps.setInt(1, pageSize);
            ps.setInt(2, (page - 1) * pageSize);
            rs = ps.executeQuery();
            while (rs.next()) {
                users.add(mapRow(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs);
            closeStatement(ps);
            closeConnection(connection);
        }
        return users;
    }

    @Override
    public int count() {
        Connection connection = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            connection = newConnection();
            st = connection.createStatement();
            rs = st.executeQuery("SELECT COUNT(*) FROM users");
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeResultSet(rs);
            closeStatement(st);
            closeConnection(connection);
        }
        return 0;
    }

    @Override
    public User insert(User user) {
        Connection connection = null;
        PreparedStatement ps = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "INSERT INTO users (email, first_name, last_name, type, status, hashed_password) VALUES (?, ?, ?, ?, 'ACTIVE', ?)"
            );
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getFirstName());
            ps.setString(3, user.getLastName());
            ps.setString(4, user.getType());
            ps.setString(5, user.getHashedPassword());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeStatement(ps);
            closeConnection(connection);
        }
        return user;
    }

    @Override
    public User update(String email, User user) {
        Connection connection = null;
        PreparedStatement ps = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "UPDATE users SET first_name = ?, last_name = ?, type = ? WHERE email = ?"
            );
            ps.setString(1, user.getFirstName());
            ps.setString(2, user.getLastName());
            ps.setString(3, user.getType());
            ps.setString(4, email);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeStatement(ps);
            closeConnection(connection);
        }
        return user;
    }

    @Override
    public void toggleStatus(String email) {
        Connection connection = null;
        PreparedStatement ps = null;
        try {
            connection = newConnection();
            ps = connection.prepareStatement(
                "UPDATE users SET status = CASE WHEN status = 'ACTIVE' THEN 'INACTIVE' ELSE 'ACTIVE' END WHERE email = ?"
            );
            ps.setString(1, email);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeStatement(ps);
            closeConnection(connection);
        }
    }

    private User mapRow(ResultSet rs) throws SQLException {
        return new User(
            rs.getString("email"),
            rs.getString("first_name"),
            rs.getString("last_name"),
            rs.getString("type"),
            rs.getString("status"),
            rs.getString("hashed_password")
        );
    }
}
