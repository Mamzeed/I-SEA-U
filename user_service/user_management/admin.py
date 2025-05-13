from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from user_management.models import (
    Customer, Category, News, SavedNews, NewsLike,
    Comment, ConservationActivity, ConservationMethod, Profile
)
from django.utils.html import format_html

# ------------------ CUSTOMER ------------------
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('user', 'fullname', 'province', 'tel')
    search_fields = ('user__username', 'fullname', 'province')

class CustomerInline(admin.StackedInline):
    model = Customer
    can_delete = False
    verbose_name_plural = 'Customer'
    fk_name = 'user'

# ------------------ CUSTOM USER ADMIN ------------------
class CustomUserAdmin(UserAdmin):
    inlines = [CustomerInline]
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        return super().get_inline_instances(request, obj)

# ต้อง unregister ก่อน
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# ------------------ CATEGORY ------------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

# ------------------ NEWS ------------------
@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'category', 'author', 'created_at', 'views')
    search_fields = ('title', 'slug', 'content', 'author__username')
    list_filter = ('category', 'created_at', 'author')
    readonly_fields = ('views',)
    prepopulated_fields = {'slug': ('title',)}

# ------------------ SAVED NEWS ------------------
@admin.register(SavedNews)
class SavedNewsAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'saved_at')
    search_fields = ('user__username', 'news__title')
    list_filter = ('saved_at',)

# ------------------ NEWS LIKE ------------------
@admin.register(NewsLike)
class NewsLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'created_at')
    search_fields = ('user__username', 'news__title')
    list_filter = ('created_at',)

# ------------------ COMMENT ------------------
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'created_at')
    search_fields = ('user__username', 'news__title', 'content')
    list_filter = ('created_at',)

# ------------------ CONSERVATION ACTIVITY ------------------
@admin.register(ConservationActivity)
class ConservationActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'location')
    list_filter = ('start_date', 'end_date')

# ------------------ CONSERVATION METHOD ------------------
@admin.register(ConservationMethod)
class ConservationMethodAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at',)

# ------------------ PROFILE ------------------
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_profile_image', 'phone', 'created_at')
    search_fields = ('user__username', 'phone')

    def display_profile_image(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; border-radius: 50%;" />',
                obj.profile_image.url
            )
        return "No Image"
    display_profile_image.short_description = "Profile Image"
