package rs.raf.rafnovosti.resources;

import rs.raf.rafnovosti.entities.Article;
import rs.raf.rafnovosti.services.ArticleService;
import rs.raf.rafnovosti.services.UserService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;

@Path("/articles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArticleResource {

    @Inject private ArticleService articleService;
    @Inject private UserService userService;

    @GET
    public Response getAll(@QueryParam("page") @DefaultValue("1") int page,
                           @QueryParam("pageSize") @DefaultValue("10") int pageSize,
                           @QueryParam("categoryId") Integer categoryId) {
        if (categoryId != null) {
            return Response.ok(articleService.findByCategory(categoryId, page, pageSize)).build();
        }
        return Response.ok(articleService.findAll(page, pageSize)).build();
    }

    @GET
    @Path("/search")
    public Response search(@QueryParam("q") @DefaultValue("") String query,
                           @QueryParam("page") @DefaultValue("1") int page,
                           @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return Response.ok(articleService.search(query, page, pageSize)).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") int id) {
        return Response.ok(articleService.findById(id)).build();
    }

    @POST
    public Response create(@Valid Article article,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        article.setAuthorEmail(userService.getEmailFromToken(token));
        return Response.status(201).entity(articleService.insert(article)).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") int id,
                           @Valid Article article,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return Response.ok(articleService.update(id, article, token)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") int id,
                           @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        articleService.delete(id, token);
        return Response.noContent().build();
    }
}
