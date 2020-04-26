from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    title = models.CharField(max_length=300, default='title')
    description = models.TextField(default='')
    creation_date = models.DateTimeField(auto_now_add=True)
    user_id = models.IntegerField(default=0)
    place = models.TextField(default='', max_length=50)
    subcategory_id = models.IntegerField(default=1)
    photo = models.CharField(default='', max_length=500, blank=True)

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

class Code(models.Model):
    code = models.CharField(max_length=6, primary_key=True)
    chat_id = models.CharField(max_length=100)
    telegram_username = models.CharField(max_length=50)
    is_valid = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '%s: %s' % (self.code, self.is_valid)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=40)
    telegram_chat_id = models.CharField(max_length=100)
    telegram_username = models.CharField(max_length=100)
    profile_photo = models.CharField(max_length = 200, default='https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png')
    faculty = models.CharField(max_length=50, default='None')
    gender = models.CharField(max_length=50, default='3')
    year_of_study = models.IntegerField(default=0)
    registration_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '%s %s' % (self.user.username, self.name)


class TeacherInfo(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    subject = models.CharField(max_length=500, default='')
    quote = models.CharField(max_length=200, default='')
    is_teaching = models.BooleanField(default=True)
    rating = models.IntegerField(default=0)
