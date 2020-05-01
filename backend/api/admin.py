from django.contrib import admin
from .models import Post, Code, UserProfile, TeacherInfo
# Register your models here.

admin.site.register(Post)
admin.site.register(Code)
admin.site.register(UserProfile)
admin.site.register(TeacherInfo)
