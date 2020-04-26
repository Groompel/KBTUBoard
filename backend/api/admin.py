from django.contrib import admin
from .models import Post, Code, UserProfile
# Register your models here.

admin.site.register(Post)
admin.site.register(Code)
admin.site.register(UserProfile)