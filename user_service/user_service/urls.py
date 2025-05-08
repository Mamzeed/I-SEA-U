from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from user_management.views import *

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'news', NewsViewSet, basename='news')
router.register(r'news-likes', NewsLikeViewSet)
router.register(r'conservation-activities', ConservationActivityViewSet)
router.register(r'conservation-methods', ConservationMethodViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', register),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/myinfo', CustomerView.as_view(), name='myinfo'),
    path('news/', NewsListView.as_view(), name='news_list'),
    path('news/<str:category_name>/', NewsListView.as_view(), name='news_list_by_category'),
    path('api/news/category/<str:category_name>/', news_by_category, name='news_by_category'),
    path('api/news/environment/', news_environment, name='news_environment'),
    path('api/news/<str:date>/<slug:slug>/', news_detail_by_date, name='news_detail_by_date'),
    path('api/news-likes/by-slug/<slug:slug>/', NewsLikeBySlugView.as_view(), name='newslike-by-slug'),
    path('api/me/', MeView.as_view(), name='me'),
    path('api/customer/', CustomerUpdateView.as_view(), name='customer_update'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)