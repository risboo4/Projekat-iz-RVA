package rs.raf.rafnovosti.resources;

import rs.raf.rafnovosti.entities.User;
import rs.raf.rafnovosti.requests.LoginRequest;
import rs.raf.rafnovosti.services.UserService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    private UserService userService;

    @POST
    @Path("/login")
    public Response login(@Valid LoginRequest request) {
        Map<String, Object> result = userService.login(request.getEmail(), request.getPassword());
        if (result == null) {
            return Response.status(401)
                .entity(Map.of("error", "Pogrešan email ili lozinka"))
                .build();
        }
        return Response.ok(result).build();
    }

    @GET
    public Response getAll(@QueryParam("page") @DefaultValue("1") int page,
                           @QueryParam("pageSize") @DefaultValue("10") int pageSize,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Nedovoljno prava")).build();
        }
        List<User> users = userService.findAll(page, pageSize);
        int total = userService.count();
        Map<String, Object> response = new HashMap<>();
        response.put("data", users);
        response.put("totalCount", total);
        return Response.ok(response).build();
    }

    @POST
    public Response create(User user,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Nedovoljno prava")).build();
        }
        return Response.status(201).entity(userService.insert(user)).build();
    }

    @PUT
    @Path("/{email}")
    public Response update(@PathParam("email") String email,
                           User user,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Nedovoljno prava")).build();
        }
        return Response.ok(userService.update(email, user)).build();
    }

    @PUT
    @Path("/{email}/toggle-status")
    public Response toggleStatus(@PathParam("email") String email,
                                 @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Nedovoljno prava")).build();
        }
        userService.toggleStatus(email);
        return Response.ok().build();
    }

    private boolean isAdmin(String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            return "ADMIN".equals(userService.getRole(token));
        } catch (Exception e) {
            return false;
        }
    }
}
