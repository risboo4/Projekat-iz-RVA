package rs.raf.rafnovosti;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import rs.raf.rafnovosti.repositories.article.ArticleRepository;
import rs.raf.rafnovosti.repositories.article.MySqlArticleRepository;
import rs.raf.rafnovosti.repositories.category.CategoryRepository;
import rs.raf.rafnovosti.repositories.category.MySqlCategoryRepository;
import rs.raf.rafnovosti.repositories.tag.MySqlTagRepository;
import rs.raf.rafnovosti.repositories.tag.TagRepository;
import rs.raf.rafnovosti.repositories.user.MySqlUserRepository;
import rs.raf.rafnovosti.repositories.user.UserRepository;
import rs.raf.rafnovosti.services.ArticleService;
import rs.raf.rafnovosti.services.CategoryService;
import rs.raf.rafnovosti.services.UserService;

import javax.inject.Singleton;
import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class RafNovostiApplication extends ResourceConfig {

    public RafNovostiApplication() {
        property(ServerProperties.BV_SEND_ERROR_IN_RESPONSE, true);

        AbstractBinder binder = new AbstractBinder() {
            @Override
            protected void configure() {
                bind(MySqlUserRepository.class).to(UserRepository.class).in(Singleton.class);
                bind(MySqlCategoryRepository.class).to(CategoryRepository.class).in(Singleton.class);
                bind(MySqlArticleRepository.class).to(ArticleRepository.class).in(Singleton.class);
                bind(MySqlTagRepository.class).to(TagRepository.class).in(Singleton.class);
                bindAsContract(UserService.class);
                bindAsContract(CategoryService.class);
                bindAsContract(ArticleService.class);
            }
        };
        register(binder);

        packages("rs.raf.rafnovosti");
    }
}
