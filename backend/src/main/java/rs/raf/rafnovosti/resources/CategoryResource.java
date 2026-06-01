package rs.raf.rafnovosti.resources;

import rs.raf.rafnovosti.entities.Category;
import rs.raf.rafnovosti.services.CategoryService;
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

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoryResource {

    @Inject private CategoryService categoryService;
    @Inject private UserService userService;

    @GET
    public Response getAll(@QueryParam("page") @DefaultValue("1") int page,
                           @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        List<Category> categories = categoryService.findAll(page, pageSize);
        int total = categoryService.count();
        Map<String, Object> response = new HashMap<>();
        response.put("data", categories);
        response.put("totalCount", total);
        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") int id) {
        return Response.ok(categoryService.findById(id)).build();
    }

    @POST
    public Response create(@Valid Category category,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Samo administrator može ovu akciju")).build();
        }
        return Response.status(201).entity(categoryService.insert(category)).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") int id,
                           @Valid Category category,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Samo administrator može ovu akciju")).build();
        }
        return Response.ok(categoryService.update(id, category)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") int id,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (!isAdmin(authHeader)) {
            return Response.status(403).entity(Map.of("error", "Samo administrator može ovu akciju")).build();
        }
        categoryService.delete(id);
        return Response.noContent().build();
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null) return false;
        String token = authHeader.replace("Bearer ", "");
        return "ADMIN".equals(userService.getRole(token));
    }
}
