package rs.raf.rafnovosti.filters;

import rs.raf.rafnovosti.services.UserService;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.Set;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    // Rute koje ne zahtevaju autentifikaciju
    private static final Set<String> PUBLIC_PATHS = Set.of(
        "users/login"
        // Ovde dodavati javne rute iz kasnijih chaptera:
        // "articles/latest", "articles/most-read", itd.
    );

    @Inject
    UserService userService;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // OPTIONS (CORS preflight) uvek propusti
        if (requestContext.getMethod().equalsIgnoreCase("OPTIONS")) {
            return;
        }

        String path = requestContext.getUriInfo().getPath();

        for (String publicPath : PUBLIC_PATHS) {
            if (path.contains(publicPath)) {
                return;
            }
        }

        try {
            String token = requestContext.getHeaderString("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }

            if (token == null || !this.userService.isAuthorized(token)) {
                requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            }
        } catch (Exception e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        }
    }
}
