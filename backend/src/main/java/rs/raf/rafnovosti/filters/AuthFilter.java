package rs.raf.rafnovosti.filters;

import rs.raf.rafnovosti.services.UserService;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    @Inject
    UserService userService;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (requestContext.getMethod().equalsIgnoreCase("OPTIONS")) {
            return;
        }

        String path = requestContext.getUriInfo().getPath();
        String method = requestContext.getMethod().toUpperCase();

        if ("GET".equals(method)) {
            if (path.startsWith("articles") || path.startsWith("categories")) {
                return;
            }
        }

        if ("POST".equals(method)) {
            if (path.equals("users/login") ||
                path.matches("articles/\\d+/comments")) {
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
