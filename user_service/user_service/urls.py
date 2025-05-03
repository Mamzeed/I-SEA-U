from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from user_management.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView, 
    TokenRefreshView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'news', NewsViewSet, basename='news')
router.register(r'saved-news', SavedNewsViewSet, basename='savednews')
router.register(r'likes', NewsLikeViewSet, basename='likes')
router.register(r'conservation-activities', ConservationActivityViewSet, basename='activities')
router.register(r'conservation-methods', ConservationMethodViewSet, basename='methods')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register', register),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/myinfo', CustomerView.as_view(), name='myinfo'),
    path('api/news/<int:news_pk>/comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/', include(router.urls)),
]
