package rs.raf.rafnovosti.repositories.user;

import rs.raf.rafnovosti.entities.User;

import java.util.List;

public interface UserRepository {
    User findByEmail(String email);
    List<User> findAll(int page, int pageSize);
    int count();
    User insert(User user);
    User update(String email, User user);
    void toggleStatus(String email);
}
