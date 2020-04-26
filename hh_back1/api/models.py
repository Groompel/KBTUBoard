from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=300, default='title')
    description = models.TextField(default='')
    place = models.TextField(default='')
    photo = models.CharField(default='', max_length=500, blank=True)
    category_id = models.IntegerField(default=1)
    subcategory_id = models.IntegerField(default=1)

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