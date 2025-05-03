from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from user_management.models import Customer
from .models import Category, News, SavedNews, NewsLike, Comment, ConservationActivity, ConservationMethod

# Register your models here.
admin.site.register(Customer)

class CustomerInline(admin.StackedInline):
    model = Customer
    can_delete = False
    verbose_name_plural = 'Customer'
    fk_name = 'user'

class CustomUserAdmin(UserAdmin):
    inlines = (CustomerInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    list_select_related = ('customer',)

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'created_at', 'views')
    search_fields = ('title', 'content', 'author__username')
    list_filter = ('category', 'created_at', 'author')
    readonly_fields = ('views',)

@admin.register(SavedNews)
class SavedNewsAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'saved_at')
    search_fields = ('user__username', 'news__title')
    list_filter = ('saved_at',)

@admin.register(NewsLike)
class NewsLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'created_at')
    search_fields = ('user__username', 'news__title')
    list_filter = ('created_at',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'created_at')
    search_fields = ('user__username', 'news__title', 'content')
    list_filter = ('created_at',)

@admin.register(ConservationActivity)
class ConservationActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'location')
    list_filter = ('start_date', 'end_date')

@admin.register(ConservationMethod)
class ConservationMethodAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at',)

# Unregister the default User admin and register our custom User admin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)