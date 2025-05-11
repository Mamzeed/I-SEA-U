from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from user_management.models import (
    Customer, Category, News, SavedNews, NewsLike, 
    Comment, ConservationActivity, ConservationMethod, Profile
)
from django.utils.html import format_html

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
    list_display = ('title', 'slug', 'category', 'author', 'created_at', 'views')
    search_fields = ('title', 'slug', 'content', 'author__username')
    list_filter = ('category', 'created_at', 'author')
    readonly_fields = ('views',)
    prepopulated_fields = {'slug': ('title',)}

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

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_profile_image', 'phone', 'created_at')

    def display_profile_image(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 50%;" />', obj.profile_image.url)
        return "No Image"
    display_profile_image.short_description = "Profile Image"