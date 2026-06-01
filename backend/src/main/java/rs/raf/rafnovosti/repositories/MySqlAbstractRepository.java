package rs.raf.rafnovosti.repositories;

import java.sql.*;

public abstract class MySqlAbstractRepository {

    public MySqlAbstractRepository() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    protected Connection newConnection() throws SQLException {
        return DriverManager.getConnection(
            "jdbc:mysql://" + getHost() + ":" + getPort() + "/" + getDatabaseName(),
            getUsername(),
            getPassword()
        );
    }

    protected String getHost() { return "localhost"; }
    protected int getPort() { return 3306; }
    protected String getDatabaseName() { return "raf_novosti"; }
    protected String getUsername() { return "root"; }
    protected String getPassword() { return "root"; }

    protected void closeStatement(Statement s) {
        if (s != null) try { s.close(); } catch (SQLException e) { e.printStackTrace(); }
    }

    protected void closeResultSet(ResultSet rs) {
        if (rs != null) try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
    }

    protected void closeConnection(Connection c) {
        if (c != null) try { c.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
}
