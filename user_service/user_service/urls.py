from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from user_management.views import (
    register, CustomerView, NewsListView, news_by_category,
    news_environment, news_detail_by_date, NewsLikeBySlugView,
    MeView, CustomerUpdateView, PublicProfileView, SavedNewsListView,
    CategoryViewSet, NewsViewSet, NewsLikeViewSet,
    ConservationActivityViewSet, ConservationMethodViewSet,
    SavedNewsDetailView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'news', NewsViewSet, basename='news')
router.register(r'news-likes', NewsLikeViewSet, basename='news-like')
router.register(r'conservation-activities', ConservationActivityViewSet)
router.register(r'conservation-methods', ConservationMethodViewSet)


urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # API routes
    path('api/', include(router.urls)),

    # Authentication & user registration
    path('api/register/', register, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Authenticated user info
    path('api/me/', MeView.as_view(), name='me'),
    path('api/customer/', CustomerUpdateView.as_view(), name='customer_update'),
    path('api/myinfo/', CustomerView.as_view(), name='myinfo'),
    path('api/public-profile/<str:username>/', PublicProfileView.as_view(), name='public_profile'),

    # Saved news
    path('api/saved-news/', SavedNewsListView.as_view(), name='saved_news_list'),
    path('api/saved-news/<int:pk>/', SavedNewsDetailView.as_view(), name='saved_news_detail'),

    # News filtering & detail
    path('api/news/category/<str:category_name>/', news_by_category, name='news_by_category'),
    path('api/news/environment/', news_environment, name='news_environment'),
    path('api/news/<str:date>/<slug:slug>/', news_detail_by_date, name='news_detail_by_date'),

    # News Likes by slug
    path('api/news-likes/by-slug/<slug:slug>/', NewsLikeBySlugView.as_view(), name='newslike_by_slug'),

    # Optional: Public news pages (non-API)
    path('news/', NewsListView.as_view(), name='news_list'),
    path('news/<str:category_name>/', NewsListView.as_view(), name='news_list_by_category'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
