package rs.raf.rafnovosti.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.apache.commons.codec.digest.DigestUtils;
import rs.raf.rafnovosti.entities.User;
import rs.raf.rafnovosti.repositories.user.UserRepository;

import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserService {

    private static final String JWT_SECRET = "raf-novosti-secret-key";
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(JWT_SECRET);

    @Inject
    UserRepository userRepository;

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null || !user.getHashedPassword().equals(DigestUtils.sha256Hex(password))) {
            return null;
        }

        if ("INACTIVE".equals(user.getStatus())) {
            throw new WebApplicationException(
                Response.status(403)
                    .entity(Map.of("error", "Vaš nalog je deaktiviran. Kontaktirajte administratora."))
                    .build()
            );
        }

        String jwt = JWT.create()
            .withSubject(email)
            .withClaim("role", user.getType())
            .withClaim("firstName", user.getFirstName())
            .withClaim("lastName", user.getLastName())
            .withIssuedAt(new Date())
            .sign(ALGORITHM);

        Map<String, Object> response = new HashMap<>();
        response.put("jwt", jwt);
        response.put("role", user.getType());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        return response;
    }

    public boolean isAuthorized(String token) {
        DecodedJWT jwt = decode(token);
        User user = userRepository.findByEmail(jwt.getSubject());
        return user != null && "ACTIVE".equals(user.getStatus());
    }

    public String getRole(String token) {
        return decode(token).getClaim("role").asString();
    }

    public String getEmailFromToken(String token) {
        return decode(token).getSubject();
    }

    private DecodedJWT decode(String token) {
        return JWT.require(ALGORITHM).build().verify(token);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAll(int page, int pageSize) {
        return userRepository.findAll(page, pageSize);
    }

    public int count() {
        return userRepository.count();
    }

    public User insert(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new WebApplicationException(
                Response.status(409)
                    .entity(Map.of("error", "Korisnik sa ovim emailom već postoji"))
                    .build()
            );
        }
        user.setHashedPassword(DigestUtils.sha256Hex(user.getPassword()));
        return userRepository.insert(user);
    }

    public User update(String email, User user) {
        if (userRepository.findByEmail(email) == null) {
            throw new WebApplicationException(
                Response.status(404)
                    .entity(Map.of("error", "Korisnik nije pronađen"))
                    .build()
            );
        }
        return userRepository.update(email, user);
    }

    public void toggleStatus(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new WebApplicationException(
                Response.status(404)
                    .entity(Map.of("error", "Korisnik nije pronađen"))
                    .build()
            );
        }
        if ("ADMIN".equals(user.getType())) {
            throw new WebApplicationException(
                Response.status(400)
                    .entity(Map.of("error", "Status administratora nije moguće menjati"))
                    .build()
            );
        }
        userRepository.toggleStatus(email);
    }
}
