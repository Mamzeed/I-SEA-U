from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from user_management.views import (
    register, CustomerView, CategoryViewSet, NewsViewSet, NewsListView,
    NewsDetailView, NewsLikeViewSet, CommentViewSet, ConservationActivityViewSet,
    ConservationMethodViewSet
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView, 
    TokenRefreshView
)

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'news', NewsViewSet)
router.register(r'news-likes', NewsLikeViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'conservation-activities', ConservationActivityViewSet)
router.register(r'conservation-methods', ConservationMethodViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', register),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/myinfo', CustomerView.as_view(), name='myinfo'),
    path('api/customer/', CustomerView.as_view(), name='customer'),
    path('news/', NewsListView.as_view(), name='news_list'),
    path('news/<str:category_name>/', NewsListView.as_view(), name='news_list_by_category'),
    path('news/<int:year>/<int:month>/<int:day>/<slug:news_slug>/', NewsDetailView.as_view(), name='news_detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)